const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const assert = require('node:assert/strict');
(async () => {
    const browser = await chromium.launch({ headless: true, channel: 'chrome' });
    try {
        const root = process.env.REFERRAL_TEST_URL || 'http://127.0.0.1:5186';
        for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
            const p = await browser.newPage({ viewport });
            await p.addInitScript(() => { window.copyWrites = []; Object.defineProperty(navigator, 'clipboard', { value: { writeText: async (text) => { window.copyWrites.push(text); } } }); });
            await p.goto(root + '?ref=FREE-9MXC2B');
            await p.getByRole('button', { name: 'Copy code', exact: true }).click();
            await p.getByRole('status').filter({ hasText: 'Code copied' }).waitFor();
            assert.deepEqual(await p.evaluate(() => window.copyWrites), ['FREEPORT_REF:FREE-9MXC2B']);
            assert.equal(await p.getByRole('link', { name: 'Already installed? Open Freeport' }).getAttribute('href'), 'freeport://referral/FREE-9MXC2B');
            assert.equal(await p.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            await p.close();
        }
        const p = await browser.newPage({ viewport: { width: 390, height: 844 } });
        let redirects = [];
        await p.route('https://freeport.onelink.me/**', async (route) => { redirects.push(route.request().url()); await route.fulfill({ status: 200, body: 'Handoff intercepted for browser validation' }); });
        await p.addInitScript(() => { window.copyWrites = []; Object.defineProperty(navigator, 'clipboard', { value: { writeText: text => { window.copyWrites.push(text); return new Promise(resolve => { window.finishCopy = resolve; }); } } }); });
        await p.goto(root + '?ref=FREE-9MXC2B');
        assert.deepEqual(await p.evaluate(() => window.copyWrites), []);
        await p.getByRole('link', { name: 'Download on the App Store', exact: true }).click();
        await p.waitForTimeout(150);
        assert.equal(redirects.length, 0);
        assert.equal(new URL(p.url()).origin, new URL(root).origin);
        await p.evaluate(() => window.finishCopy());
        await p.waitForURL('https://freeport.onelink.me/**');
        const handoff = new URL(redirects[0]);
        assert.equal(handoff.searchParams.get('deep_link_sub1'), 'FREE-9MXC2B');
        assert.equal(handoff.searchParams.get('af_dp'), 'freeport://referral/FREE-9MXC2B');
        await p.close();
        const denied = await browser.newPage({ viewport: { width: 390, height: 844 } });
        let deniedRedirect = false;
        await denied.route('https://freeport.onelink.me/**', async (route) => { deniedRedirect = true; await route.fulfill({ status: 200, body: 'Explicit continuation verified' }); });
        await denied.addInitScript(() => { Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw Error('Denied'); } } }); document.execCommand = () => false; });
        await denied.goto(root + '?ref=FREE-9MXC2B');
        await denied.getByRole('link', { name: 'Download on the App Store', exact: true }).click();
        await denied.getByRole('status').filter({ hasText: 'Copy didn’t work' }).waitFor();
        assert.equal(deniedRedirect, false);
        await denied.getByRole('link', { name: 'I’ve saved my code — continue to the App Store' }).click();
        await denied.waitForURL('https://freeport.onelink.me/**');
        assert.equal(deniedRedirect, true);
        await denied.close();
        const plain = await browser.newPage();
        await plain.goto(root);
        assert.equal(await plain.getByRole('button', { name: 'Copy code', exact: true }).count(), 0);
        assert.match(await plain.getByRole('link', { name: 'Download on the App Store', exact: true }).getAttribute('href'), /^https:\/\/apps.apple.com\//);
        await plain.close();
        // SSR anchors must still install with all page JavaScript disabled.
        const noJsContext = await browser.newContext({ javaScriptEnabled: false });
        const noJs = await noJsContext.newPage();
        await noJs.route('https://freeport.onelink.me/**', route => route.fulfill({ status: 200, body: 'No JavaScript handoff verified' }));
        await noJs.goto(root + '?ref=FREE-9MXC2B');
        const noJsTarget = new URL(await noJs.getByRole('link', { name: 'Get it on Google Play', exact: true }).getAttribute('href'));
        assert.equal(noJsTarget.searchParams.get('deep_link_sub1'), 'FREE-9MXC2B');
        assert.match(noJsTarget.searchParams.get('af_web_dp'), /^https:\/\/play.google.com\//);
        await noJs.getByRole('link', { name: 'Get it on Google Play', exact: true }).click();
        await noJs.waitForURL('https://freeport.onelink.me/**');
        await noJsContext.close();
        // A changed choice cancels the pending store redirect even if copy resolves later.
        const canceled = await browser.newPage();
        let canceledRedirects = 0;
        await canceled.route('https://freeport.onelink.me/**', route => { canceledRedirects++; return route.fulfill({ status: 200, body: 'Unexpected redirect' }); });
        await canceled.addInitScript(() => {
            Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => new Promise(resolve => { window.finishCopy = resolve; }) } });
            // Avoid launching an actual installed desktop app, preserving React's click handler.
            document.addEventListener('click', event => { if (event.target.closest('a[href^="freeport:"]'))
                event.preventDefault(); });
        });
        await canceled.goto(root + '?ref=FREE-9MXC2B');
        await canceled.getByRole('link', { name: 'Download on the App Store', exact: true }).click();
        await canceled.getByRole('status').filter({ hasText: 'Copying' }).waitFor();
        await canceled.getByRole('link', { name: 'Already installed? Open Freeport' }).click();
        await canceled.evaluate(() => window.finishCopy());
        await canceled.waitForTimeout(200);
        assert.equal(canceledRedirects, 0);
        assert.equal(await canceled.getByRole('status').textContent(), '');
        // Cancellation releases the action gate, so a later deliberate attempt works.
        await canceled.getByRole('link', { name: 'Get it on Google Play', exact: true }).click();
        await canceled.evaluate(() => window.finishCopy());
        await canceled.waitForURL('https://freeport.onelink.me/**');
        assert.equal(canceledRedirects, 1);
        assert.match(new URL(canceled.url()).searchParams.get('af_web_dp'), /^https:\/\/play.google.com\//);
        await canceled.close();
        console.log('PASS mobile+desktop rendering, exact clipboard marker, no mount copy, awaited navigation, denied copy stays visible, explicit continuation, installed-app URL, unchanged no-ref anchors, no-JavaScript install, cancellation and subsequent Android handoff');
    }
    finally {
        await browser.close();
    }
})().catch(e => { console.error(e); process.exitCode = 1; });
