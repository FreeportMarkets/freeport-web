import type { Metadata } from 'next';
import ReferralInstallCta from './ReferralInstallCta';

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

export default function Home({ searchParams }: { searchParams?: { ref?: string | string[] } }) {
  const rawRef = typeof searchParams?.ref === 'string' ? searchParams.ref.trim().toUpperCase() : '';
  const code = /^[A-Z0-9][A-Z0-9_-]{1,63}$/.test(rawRef) ? rawRef : null;
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      boxSizing: 'border-box',
      backgroundColor: '#0a0a0a',
    }}>
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
      <ReferralInstallCta code={code} />
    </div>
  );
}
