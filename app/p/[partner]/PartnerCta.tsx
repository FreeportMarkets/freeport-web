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
    (store: Store) => {
      const url = new URL(window.location.href);
      const clickId = url.searchParams.get('click_id') ?? uuid();

      // 1. log the click (fire-and-forget — never block the redirect)
      fetch(`${BACKEND}/v1/points/attribution/click`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ click_id: clickId, code, partner, store }),
        keepalive: true,
      }).catch(() => {});

      // 2. clipboard bridge for cold-install attribution
      void writePromoToClipboard(code);

      // 3. straight to the store the user picked
      window.location.href = storeUrl(store);
    },
    [partner, code],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 320 }}>
      <button onClick={() => go('ios')} style={storeButtonStyle} aria-label="Download on the App Store">
        <span style={{ fontSize: 22, lineHeight: 1 }}></span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
          <span style={{ fontSize: 11, opacity: 0.85 }}>Download on the</span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>App Store</span>
        </span>
      </button>

      <button onClick={() => go('android')} style={storeButtonStyle} aria-label="Get it on Google Play">
        <span style={{ fontSize: 20, lineHeight: 1 }}>▶</span>
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
          <span style={{ fontSize: 11, opacity: 0.85 }}>Get it on</span>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Google Play</span>
        </span>
      </button>
    </div>
  );
}

const storeButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  width: '100%',
  padding: '14px 20px',
  backgroundColor: '#fff',
  color: '#000',
  border: 'none',
  borderRadius: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
};
