'use client';

import { useCallback } from 'react';
import { writePromoToClipboard, storeUrl, type Store } from '../../../lib/deeplink';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://trading-api.freeportmarkets.com';

function uuid(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function PartnerCta({ partner, code }: { partner: string; code: string }) {
  // Both store buttons share the same click_id for this page load so a user who
  // taps both doesn't double-count as two distinct clicks.
  const go = useCallback(
    async (store: Store) => {
      const url = new URL(window.location.href);
      const clickId = url.searchParams.get('click_id') ?? uuid();

      // 1. log the click (fire-and-forget — never block the redirect)
      fetch(`${BACKEND}/v1/points/attribution/click`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ click_id: clickId, code, partner, store }),
        keepalive: true,
      }).catch(() => {});

      // 2. clipboard bridge for cold-install attribution — AWAIT so the write
      //    commits before we hand off to the store. An unawaited write followed
      //    by an immediate window.location.href can be torn down mid-flight,
      //    especially on the fast Android → Play Store transition.
      await writePromoToClipboard(code);

      // 3. now go to the store the user picked
      window.location.href = storeUrl(store);
    },
    [partner, code],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <button onClick={() => void go('ios')} style={badgeButtonStyle} aria-label="Download on the App Store">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/badges/app-store-badge.svg" alt="Download on the App Store" style={appStoreImgStyle} />
      </button>

      <button onClick={() => void go('android')} style={badgeButtonStyle} aria-label="Get it on Google Play">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/badges/google-play-badge.svg" alt="Get it on Google Play" style={playImgStyle} />
      </button>
    </div>
  );
}

// Both official badges rendered at the SAME width, stacked — equal width reads
// as "same size" for stacked buttons regardless of each SVG's internal padding.
const BADGE_WIDTH = 200;
const badgeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};
const appStoreImgStyle: React.CSSProperties = {
  width: BADGE_WIDTH,
  height: 'auto',
  display: 'block',
};
const playImgStyle = appStoreImgStyle;
