import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const themePath = new URL('../lib/shareTheme.ts', import.meta.url);
const themeSource = readFileSync(themePath, 'utf8');
const compiledTheme = ts.transpileModule(themeSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const compiledModule = { exports: {} };
vm.runInNewContext(compiledTheme, {
  exports: compiledModule.exports,
  module: compiledModule,
});

const { FIXED_DARK_SHARE_COLORS } = compiledModule.exports;

test('fixed-dark share colors expose the approved brand and financial roles', () => {
  assert.equal(FIXED_DARK_SHARE_COLORS.brandFill, '#4C80F0');
  assert.equal(FIXED_DARK_SHARE_COLORS.brandAccent, '#5B8AF2');
  assert.equal(FIXED_DARK_SHARE_COLORS.onBrandFill, '#000000');
  assert.equal(FIXED_DARK_SHARE_COLORS.positive, '#00C805');
  assert.equal(FIXED_DARK_SHARE_COLORS.negative, '#F5471C');
  assert.equal(FIXED_DARK_SHARE_COLORS.positiveTint, 'rgba(0, 200, 5, 0.15)');
  assert.equal(FIXED_DARK_SHARE_COLORS.negativeTint, 'rgba(245, 71, 28, 0.15)');
});

test('trade links and generated images consume the shared roles without stale brand colors', () => {
  const consumerPaths = [
    '../app/t/[data]/ViewTradeButton.tsx',
    '../app/t/[data]/page.tsx',
    '../app/api/og/route.tsx',
    '../app/api/og-referral/route.tsx',
  ];
  const consumers = consumerPaths.map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
  const source = consumers.join('\n');

  assert.match(source, /FIXED_DARK_SHARE_COLORS\.brandFill/);
  assert.match(source, /FIXED_DARK_SHARE_COLORS\.brandAccent/);
  assert.match(source, /FIXED_DARK_SHARE_COLORS\.onBrandFill/);
  assert.match(source, /FIXED_DARK_SHARE_COLORS\.positive/);
  assert.match(source, /FIXED_DARK_SHARE_COLORS\.negative/);
  assert.doesNotMatch(
    source,
    /#(?:1d9bf0|3b82f6|9bcdf2|22c55e|ef4444)|rgba\((?:34, 197, 94|239, 68, 68)/i,
  );
});

test('the referral preview keeps its promotional headline in the sans-serif system', () => {
  const source = readFileSync(new URL('../app/api/og-referral/route.tsx', import.meta.url), 'utf8');

  assert.equal((source.match(/fontFamily: 'sans serif'/g) || []).length, 3);
});
