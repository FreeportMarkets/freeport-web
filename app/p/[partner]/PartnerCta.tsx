'use client';

import { useCallback } from 'react';
import { detectPlatform, writePromoToClipboard, openAppThenStore } from '../../../lib/deeplink';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://trading-api.freeportmarkets.com';

function uuid(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function PartnerCta({ partner, code }: { partner: string; code: string }) {
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const platform = detectPlatform(navigator.userAgent);
      const url = new URL(window.location.href);
      const clickId = url.searchParams.get('click_id') ?? uuid();

      fetch(`${BACKEND}/v1/points/attribution/click`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ click_id: clickId, code, partner }),
        keepalive: true,
      }).catch(() => {});

      void writePromoToClipboard(code);

      const deepLink = `https://share.freeportmarkets.com/p/${partner}?code=${encodeURIComponent(code)}`;
      openAppThenStore(deepLink, platform);
    },
    [partner, code],
  );

  return (
    <a
      href="#"
      onClick={onClick}
      style={{
        padding: '16px 40px', backgroundColor: '#1d9bf0', color: '#fff',
        borderRadius: 9999, textDecoration: 'none', fontWeight: 700,
        fontSize: 17, display: 'inline-block',
      }}
    >
      Get Freeport
    </a>
  );
}
