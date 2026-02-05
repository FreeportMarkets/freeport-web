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
  const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://share.freeportmarkets.com'}/api/og?a=${encodeURIComponent(trade.a)}&t=${encodeURIComponent(trade.t)}&h=${encodeURIComponent(trade.h)}&c=${encodeURIComponent(trade.c.slice(0, 200))}`;

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
          <h1 style={styles.errorTitle}>Trade not found</h1>
          <p style={styles.errorText}>This trade may have expired or the link is invalid.</p>
          <a href="https://apps.apple.com/app/freeport/id6745072874" style={styles.ctaButton}>
            Get Freeport
          </a>
        </div>
      </div>
    );
  }

  const isSell = trade.a === 'SELL';
  const action = isSell ? 'Sell' : 'Buy';

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Brand Header */}
        <div style={styles.brandHeader}>
          <div style={styles.logoContainer}>
            <img src="/logo-boat.png" alt="Freeport" width={18} height={18} style={{ objectFit: 'contain' }} />
          </div>
          <span style={styles.brandName}>Freeport</span>
        </div>

        {/* Trade Info */}
        <div style={styles.tradeSection}>
          <div style={styles.tradeHeader}>
            <div style={{
              ...styles.actionBadge,
              backgroundColor: isSell ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            }}>
              <span style={{
                ...styles.actionText,
                color: isSell ? '#ef4444' : '#22c55e',
              }}>
                {action}
              </span>
            </div>
            <span style={styles.ticker}>{trade.t}</span>
          </div>

          {/* Quote */}
          <div style={styles.quoteSection}>
            <div style={styles.handleRow}>
              <div style={styles.avatar}>
                {trade.h.charAt(0).toUpperCase()}
              </div>
              <span style={styles.handle}>@{trade.h}</span>
            </div>
            <p style={styles.content}>{trade.c}</p>
          </div>
        </div>

        {/* CTA */}
        <div style={styles.ctaContainer}>
          <a
            href={`freeport://t/${params.data}${ref ? `?ref=${ref}` : ''}`}
            style={styles.ctaButton}
          >
            View Trade
          </a>
          <a
            href="https://apps.apple.com/app/freeport/id6745072874"
            style={styles.ctaSecondary}
          >
            Get Freeport for iOS
          </a>
          <span style={styles.tagline}>Trade smarter with real-time signals</span>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100dvh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#000000',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  card: {
    maxWidth: 400,
    width: '100%',
    backgroundColor: '#16181c',
    borderRadius: 20,
    padding: 24,
    border: '1px solid #2f3336',
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 16,
    marginBottom: 16,
    borderBottom: '1px solid #2f3336',
  },
  tradeSection: {
    marginBottom: 24,
  },
  tradeHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  actionBadge: {
    padding: '8px 16px',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 15,
    fontWeight: 700,
  },
  ticker: {
    fontSize: 32,
    fontWeight: 700,
    color: '#e7e9ea',
  },
  quoteSection: {
    paddingLeft: 16,
    borderLeft: '3px solid #3b82f6',
    marginBottom: 24,
  },
  handleRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2f3336',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#71767b',
    fontSize: 14,
    fontWeight: 600,
  },
  handle: {
    color: '#71767b',
    fontSize: 15,
    fontWeight: 500,
  },
  content: {
    color: '#e7e9ea',
    fontSize: 17,
    lineHeight: 1.5,
    margin: 0,
  },
  ctaContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  ctaButton: {
    display: 'inline-block',
    padding: '14px 48px',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: 50,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16,
    textAlign: 'center',
  },
  ctaSecondary: {
    color: '#6b7280',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 14,
  },
  logoContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontWeight: 600,
    fontSize: 15,
    color: '#e7e9ea',
  },
  tagline: {
    fontSize: 13,
    color: '#52525b',
    marginTop: 4,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#e7e9ea',
    marginBottom: 8,
    marginTop: 0,
  },
  errorText: {
    fontSize: 15,
    color: '#71767b',
    marginBottom: 20,
  },
};
