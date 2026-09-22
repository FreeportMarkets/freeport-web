import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../lib/deeplink.ts', import.meta.url), 'utf8');
function load(globals = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText, { module, exports: module.exports, URL, ...globals });
  return module.exports;
}

test('the creator install link carries the same code through OneLink and installed-app routes', () => {
  const { referralInstallUrl, APP_STORE_URL } = load();
  const url = new URL(referralInstallUrl('FREE-9MXC2B', 'ios'));
  assert.equal(url.origin + url.pathname, 'https://freeport.onelink.me/N9I3');
  assert.equal(url.searchParams.get('deep_link_sub1'), 'FREE-9MXC2B');
  assert.equal(url.searchParams.get('deep_link_value'), 'referral');
  assert.equal(url.searchParams.get('af_dp'), 'freeport://referral/FREE-9MXC2B');
  assert.equal(url.searchParams.get('af_web_dp'), APP_STORE_URL);
  assert.equal(url.searchParams.get('pid'), 'creator_referral');
  assert.equal(url.searchParams.get('c'), 'creator_program');
});

test('unsafe or malformed overrides fall back to the verified Freeport template', () => {
  const { referralInstallUrl } = load();
  for (const base of ['javascript:alert(1)', 'https://elsewhere.onelink.me/test', 'https://freeport.onelink.me/', 'broken']) {
    const url = new URL(referralInstallUrl('FREE-9MXC2B', 'android', base));
    assert.equal(url.origin + url.pathname, 'https://freeport.onelink.me/N9I3');
  }
});

test('clipboard promise resolves only after referral write completes; partner marker is preserved', async () => {
  let complete;
  const writes = [];
  const { writeReferralToClipboard, writePromoToClipboard } = load({ navigator: {
    clipboard: { writeText: (text) => { writes.push(text); return new Promise((resolve) => { complete = resolve; }); } },
  } });
  let finished = false;
  const pending = writeReferralToClipboard('FREE-9MXC2B').then((value) => { finished = true; return value; });
  await Promise.resolve();
  assert.equal(finished, false);
  assert.equal(writes[0], 'FREEPORT_REF:FREE-9MXC2B');
  complete();
  assert.equal(await pending, true);
  const partner = writePromoToClipboard('PARTNER');
  assert.equal(writes[1], 'FREEPORT_PROMO:PARTNER');
  complete();
  assert.equal(await partner, true);
});

test('blocked clipboard reports failure and cleans up the fallback element', async () => {
  let removed = false;
  const { writeReferralToClipboard } = load({
    navigator: { clipboard: { writeText: async () => { throw new Error('denied'); } } },
    document: {
      createElement: () => ({ setAttribute() {}, style: {}, select() {} }),
      body: { appendChild() {}, removeChild() { removed = true; } },
      execCommand: () => false,
    },
  });
  assert.equal(await writeReferralToClipboard('FREE-9MXC2B'), false);
  assert.equal(removed, true);
});
