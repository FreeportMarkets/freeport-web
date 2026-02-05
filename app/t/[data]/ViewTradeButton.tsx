'use client';

import { useCallback } from 'react';

interface ViewTradeButtonProps {
  deepLink: string;
}

export default function ViewTradeButton({ deepLink }: ViewTradeButtonProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    const appStoreUrl = 'https://apps.apple.com/app/freeport/id6745072874';

    // Try to open the app
    window.location.href = deepLink;

    // If app doesn't open after 1.5s, redirect to App Store
    setTimeout(() => {
      // Check if page is still visible (app didn't open)
      if (!document.hidden) {
        window.location.href = appStoreUrl;
      }
    }, 1500);
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
