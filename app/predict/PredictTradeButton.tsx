'use client';

import { useCallback } from 'react';
import { detectPlatform, openAppThenStore } from '../../lib/deeplink';

interface PredictTradeButtonProps {
  marketId: string;
  label?: string;
  style?: React.CSSProperties;
}

export default function PredictTradeButton({
  marketId,
  label = 'Trade in App',
  style,
}: PredictTradeButtonProps) {
  const deepLink = `freeport://predict/${marketId}`;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openAppThenStore(deepLink, detectPlatform(navigator.userAgent));
    },
    [deepLink],
  );

  return (
    <a
      href={deepLink}
      onClick={handleClick}
      style={{
        display: 'inline-block',
        padding: '10px 22px',
        backgroundColor: '#22c55e',
        color: '#000000',
        borderRadius: 9999,
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '0.1px',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {label}
    </a>
  );
}
