import type { Metadata } from 'next';

// Trade data encoded in URL
interface TradeData {
  a: string;  // action: BUY or SELL
  t: string;  // ticker
  h: string;  // handle
  c: string;  // content
}

function decodeTradeData(encoded: string): TradeData | null {
  try {
    // URL-safe base64 decode
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Dynamic OG metadata - this is what makes the rich preview work
export async function generateMetadata({ params }: { params: { data: string } }): Promise<Metadata> {
  const trade = decodeTradeData(params.data);

  if (!trade) {
    return {
      title: 'Trade on Freeport',
      description: 'Trade smarter with Freeport',
    };
  }

  const action = trade.a === 'SELL' ? 'Sell' : 'Buy';
  const title = `${action} ${trade.t}`;
  const description = `@${trade.h}: "${trade.c.slice(0, 120)}${trade.c.length > 120 ? '...' : ''}"`;
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://freeport-web.vercel.app'}/api/og?a=${encodeURIComponent(trade.a)}&t=${encodeURIComponent(trade.t)}&h=${encodeURIComponent(trade.h)}&c=${encodeURIComponent(trade.c.slice(0, 200))}`;

  return {
    title: `${title} | Freeport`,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'article',
      siteName: 'Freeport',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function TradePage({ params, searchParams }: {
  params: { data: string };
  searchParams: { ref?: string };
}) {
  const trade = decodeTradeData(params.data);
  const ref = searchParams.ref;

  if (!trade) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Trade not found</h1>
          <a href="https://apps.apple.com/app/freeport/id6745072874" style={styles.ctaButton}>
            Get Freeport
          </a>
        </div>
      </div>
    );
  }

  const action = trade.a === 'SELL' ? 'Sell' : 'Buy';
  const actionColor = trade.a === 'SELL' ? '#ef4444' : '#22c55e';
  const actionEmoji = trade.a === 'SELL' ? '📉' : '📈';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Action Badge */}
        <div style={{ ...styles.actionBadge, color: actionColor }}>
          {actionEmoji} {action} {trade.t}
        </div>

        {/* Quote */}
        <div style={styles.quote}>
          <span style={styles.handle}>@{trade.h}</span>
          <p style={styles.content}>"{trade.c}"</p>
        </div>

        {/* CTAs */}
        <div style={styles.ctaContainer}>
          <a
            href={`freeport://t/${params.data}${ref ? `?ref=${ref}` : ''}`}
            style={styles.ctaButton}
          >
            Open in Freeport
          </a>
          <a
            href="https://apps.apple.com/app/freeport/id6745072874"
            style={styles.ctaSecondary}
          >
            Get Freeport
          </a>
        </div>

        {/* Branding */}
        <div style={styles.branding}>
          <span style={styles.logo}>Freeport</span>
          <span style={styles.tagline}>Trade smarter</span>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0d0d0e',
  },
  card: {
    maxWidth: 480,
    width: '100%',
    backgroundColor: '#1a1a1c',
    borderRadius: 16,
    padding: 24,
  },
  actionBadge: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
  },
  quote: {
    marginBottom: 24,
  },
  handle: {
    color: '#4d91f0',
    fontSize: 14,
    fontWeight: 600,
  },
  content: {
    color: '#e5e7eb',
    fontSize: 18,
    lineHeight: 1.5,
    marginTop: 8,
  },
  ctaContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  ctaButton: {
    display: 'block',
    padding: '16px 24px',
    backgroundColor: '#4d91f0',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16,
    textAlign: 'center',
  },
  ctaSecondary: {
    display: 'block',
    padding: '16px 24px',
    backgroundColor: 'transparent',
    color: '#6b7280',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 14,
    textAlign: 'center',
    border: '1px solid #374151',
  },
  branding: {
    marginTop: 24,
    paddingTop: 16,
    borderTop: '1px solid #374151',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 700,
    fontSize: 16,
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: '#6b7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 20,
  },
};
