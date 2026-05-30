'use client';

import { useCallback } from 'react';
import { detectPlatform, openAppThenStore, writePromoToClipboard } from '../../../lib/deeplink';

interface ViewTradeButtonProps {
  deepLink: string;
}

export default function ViewTradeButton({ deepLink }: ViewTradeButtonProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    // Copy promo code to clipboard for deferred deep linking (shared helper).
    const refMatch = deepLink.match(/[?&]ref=([^&]+)/);
    if (refMatch) {
      void writePromoToClipboard(refMatch[1]);
    }

    openAppThenStore(deepLink, detectPlatform(navigator.userAgent));
  }, [deepLink]);

  return (
    <a
      href={deepLink}
      onClick={handleClick}
      style={{
        padding: '16px 40px',
        backgroundColor: '#1d9bf0',
        color: '#fff',
        borderRadius: 9999,
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 17,
        display: 'inline-block',
      }}
    >
      View Trade
    </a>
  );
}
