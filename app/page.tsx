import { Suspense } from 'react';
import type { Metadata } from 'next';
import RefClipboard from './RefClipboard';

export const metadata: Metadata = {
  metadataBase: new URL('https://share.freeportmarkets.com'),
  title: 'Freeport Markets',
  description:
    'Invite friends to Freeport. You and each qualifying friend can receive $50 in promotional, non-cash points, and you earn 20% of the points they generate. Terms and eligibility apply.',
  openGraph: {
    title: 'Earn up to $500 in Freeport points',
    description:
      'You and each qualifying friend can receive $50 in promotional, non-cash points. Earn 20% of the points they generate. Terms and eligibility apply.',
    siteName: 'Freeport',
    type: 'website',
    images: [
      {
        url: '/api/og-referral',
        width: 1200,
        height: 630,
        alt: 'Freeport referral offer: earn up to $500 in promotional points',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn up to $500 in Freeport points',
    description:
      'You and each qualifying friend can receive $50 in promotional, non-cash points. Earn 20% of the points they generate. Terms and eligibility apply.',
    images: ['/api/og-referral'],
  },
};

// Both official badges rendered at the SAME width, stacked — equal width reads
// as "same size" for stacked buttons regardless of each SVG's internal padding.
const BADGE_WIDTH = 200;
const badgeLinkStyle: React.CSSProperties = { display: 'inline-block' };
const appStoreImgStyle: React.CSSProperties = { width: BADGE_WIDTH, height: 'auto', display: 'block' };
const playImgStyle = appStoreImgStyle;

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
        Trade like a hedge fund.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <a
          href="https://apps.apple.com/us/app/freeport-markets/id6758952978"
          aria-label="Download on the App Store"
          style={badgeLinkStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/badges/app-store-badge.svg" alt="Download on the App Store" style={appStoreImgStyle} />
        </a>

        <a
          href="https://play.google.com/store/apps/details?id=com.freeportmarkets.app"
          aria-label="Get it on Google Play"
          style={badgeLinkStyle}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/badges/google-play-badge.svg" alt="Get it on Google Play" style={playImgStyle} />
        </a>
      </div>
    </div>
  );
}
