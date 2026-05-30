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
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, background: '#000', color: '#fff', padding: 24, textAlign: 'center' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Welcome to Freeport</h1>
      <p style={{ maxWidth: 360, opacity: 0.8 }}>
        Tap below to download Freeport. Your reward is applied automatically when you log in.
      </p>
      {code ? <PartnerCta partner={partner} code={code} /> : <p style={{ color: '#f55' }}>Missing promo code.</p>}
    </main>
  );
}
