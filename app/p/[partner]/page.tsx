import PartnerCta from './PartnerCta';

export const dynamic = 'force-dynamic';

export default function PartnerPage({
  params,
  searchParams,
}: {
  params: { partner: string };
  searchParams: { code?: string };
}) {
  const partner = params.partner;
  const code = (searchParams.code ?? '').toUpperCase();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#0a0a0a',
      }}
    >
      {/* Logo in rounded container — matches homepage */}
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          padding: 12,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-boat.png" alt="Freeport" width={56} height={56} style={{ objectFit: 'contain' }} />
      </div>

      <h1
        style={{
          fontSize: 48,
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: 12,
          marginTop: 0,
          letterSpacing: '-1px',
        }}
      >
        Freeport
      </h1>

      <p
        style={{
          color: '#a1a1aa',
          fontSize: 18,
          marginBottom: 8,
          marginTop: 0,
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Trade like a hedge fund.
      </p>

      <p
        style={{
          color: '#6b7280',
          fontSize: 15,
          marginBottom: 40,
          marginTop: 0,
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 1.5,
        }}
      >
        Reward applied upon download and login.
      </p>

      {code ? (
        <PartnerCta partner={partner} code={code} />
      ) : (
        <p style={{ color: '#f55' }}>Missing promo code.</p>
      )}
    </div>
  );
}
