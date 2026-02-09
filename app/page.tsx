import { Suspense } from 'react';
import type { Metadata } from 'next';
import RefClipboard from './RefClipboard';

export const metadata: Metadata = {
  title: 'Freeport – Get $20 in Pre-IPO Equity',
  description: 'Join Freeport and we both get $20 in pre-IPO equity from Anthropic, SpaceX, OpenAI, or Kalshi. Trade smarter with real-time signals.',
  openGraph: {
    title: 'Get $20 in Pre-IPO Equity',
    description: 'Join Freeport with my link. Sign up, trade $15, and we both get $20 in Anthropic, SpaceX, OpenAI, or Kalshi equity.',
    siteName: 'Freeport',
    type: 'website',
    images: [
      {
        url: '/api/og-referral',
        width: 1200,
        height: 630,
        alt: 'Freeport – Earn Pre-IPO Equity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get $20 in Pre-IPO Equity',
    description: 'Join Freeport and we both get $20 in Anthropic, SpaceX, OpenAI, or Kalshi equity.',
    images: ['/api/og-referral'],
  },
};

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#0a0a0a',
    }}>
      {/* Clipboard side effect for referral deep linking */}
      <Suspense>
        <RefClipboard />
      </Suspense>

      {/* Logo in rounded container */}
      <div style={{
        width: 88,
        height: 88,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        padding: 12,
      }}>
        <img
          src="/logo-boat.png"
          alt="Freeport"
          width={56}
          height={56}
          style={{
            objectFit: 'contain',
          }}
        />
      </div>
      <h1 style={{
        fontSize: 48,
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: 12,
        marginTop: 0,
        letterSpacing: '-1px',
      }}>
        Freeport
      </h1>
      <p style={{
        color: '#a1a1aa',
        fontSize: 18,
        marginBottom: 40,
        marginTop: 0,
        textAlign: 'center',
        maxWidth: 320,
        lineHeight: 1.5,
      }}>
        Trade smarter with real-time signals
      </p>
      <a
        href="https://apps.apple.com/app/freeport/id6745072874"
        style={{
          padding: '16px 40px',
          backgroundColor: '#1d9bf0',
          color: '#fff',
          borderRadius: 9999,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 17,
        }}
      >
        Download on iOS
      </a>
      <p style={{
        marginTop: 56,
        color: '#52525b',
        fontSize: 13,
      }}>
        Available on the App Store
      </p>
    </div>
  );
}
