'use client';

import { useEffect, useRef, useState } from 'react';
import { referralInstallUrl, storeUrl, writeReferralToClipboard, type Store } from '../lib/deeplink';

const badgeStyle: React.CSSProperties = { width: 200, height: 'auto', display: 'block' };
const buttonStyle: React.CSSProperties = {
  background: 'none', border: 0, padding: 0, color: 'inherit', cursor: 'pointer',
};
const textButtonStyle: React.CSSProperties = {
  ...buttonStyle, minHeight: 44, padding: '8px 12px', font: 'inherit',
  textDecoration: 'underline', textUnderlineOffset: 4,
};

export default function ReferralInstallCta({ code }: { code: string | null }) {
  const [status, setStatus] = useState<'idle' | 'copying' | 'copied' | 'failed'>('idle');
  const [pendingStore, setPendingStore] = useState<Store | null>(null);
  const busy = useRef(false);
  const action = useRef(0);

  useEffect(() => {
    busy.current = false;
    setStatus('idle');
    setPendingStore(null);
    return () => { action.current++; };
  }, [code]);

  function cancelStoreAction() {
    action.current++;
    busy.current = false;
    setStatus('idle');
    setPendingStore(null);
  }

  async function copyAndContinue(store?: Store) {
    if (!code || busy.current) return;
    const currentAction = ++action.current;
    busy.current = true;
    setStatus('copying');
    setPendingStore(store ?? null);
    const copied = await writeReferralToClipboard(code);
    if (currentAction !== action.current) return;
    setStatus(copied ? 'copied' : 'failed');
    busy.current = false;
    if (copied && store) {
      window.location.assign(referralInstallUrl(code, store, process.env.NEXT_PUBLIC_REFERRAL_ONELINK_URL));
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: '100%', maxWidth: 360 }}>
      {code && (
        <div style={{ textAlign: 'center', width: '100%', marginBottom: 8 }}>
          <p style={{ margin: '0 0 8px', color: '#c4c4cc', fontSize: 15 }}>Your referral code</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 22, letterSpacing: '0.02em', overflowWrap: 'anywhere', userSelect: 'all' }}>{code}</strong>
            <button type="button" onClick={() => void copyAndContinue()} disabled={status === 'copying'} style={textButtonStyle}>
              Copy code
            </button>
          </div>
          <p style={{ color: '#c4c4cc', fontSize: 14, lineHeight: 1.6, margin: '8px 0 0' }}>
            Download with this referral link, then open Freeport and sign in.
            We’ll also copy your code as a backup. Allow pasting if asked, or enter it in the app’s referral or promo code field.
          </p>
          <p role="status" aria-live="polite" style={{ minHeight: 22, margin: '12px 0 0', fontSize: 14, lineHeight: 1.5, color: status === 'failed' ? '#ffd59e' : '#c4c4cc' }}>
            {status === 'copying' && 'Copying your code…'}
            {status === 'copied' && 'Code copied. Keep it until you’ve signed in.'}
            {status === 'failed' && 'Copy didn’t work. Save the code above and enter it after signing in.'}
          </p>
        </div>
      )}

      {(['ios', 'android'] as const).map((store) => {
        const label = store === 'ios' ? 'Download on the App Store' : 'Get it on Google Play';
        const badge = <img src={`/badges/${store === 'ios' ? 'app-store' : 'google-play'}-badge.svg`} alt={label} style={badgeStyle} />;
        return code ? (
          <a key={store} href={referralInstallUrl(code, store, process.env.NEXT_PUBLIC_REFERRAL_ONELINK_URL)}
            aria-label={label} aria-disabled={status === 'copying'}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              void copyAndContinue(store);
            }} style={buttonStyle}>{badge}</a>
        ) : (
          <a key={store} href={storeUrl(store)} aria-label={label}>{badge}</a>
        );
      })}

      {code && status === 'failed' && pendingStore && (
        <a href={referralInstallUrl(code, pendingStore, process.env.NEXT_PUBLIC_REFERRAL_ONELINK_URL)}
          style={{ ...textButtonStyle, textAlign: 'center', lineHeight: 1.5 }}>
          I’ve saved my code — continue to {pendingStore === 'ios' ? 'the App Store' : 'Google Play'}
        </a>
      )}

      {code && <a href={`freeport://referral/${encodeURIComponent(code)}`} onClick={cancelStoreAction}
        style={{ ...textButtonStyle, marginTop: 8 }}>
        Already installed? Open Freeport
      </a>}
    </div>
  );
}
