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
        <div style={styles.content}>
          <div style={styles.logoMark}>
            <img src="/logo-boat.png" alt="Freeport" width={32} height={32} style={{ objectFit: 'contain' }} />
          </div>
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
  const action = isSell ? 'SELL' : 'BUY';

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Logo */}
        <div style={styles.logoMark}>
          <img src="/logo-boat.png" alt="Freeport" width={32} height={32} style={{ objectFit: 'contain' }} />
        </div>

        {/* Trade Signal */}
        <div style={styles.signalCard}>
          {/* Action + Ticker */}
          <div style={styles.tradeHeader}>
            <span style={{
              ...styles.actionBadge,
              backgroundColor: isSell ? '#2d1f1f' : '#1a2e1a',
              color: isSell ? '#f87171' : '#4ade80',
            }}>
              {action}
            </span>
            <span style={styles.ticker}>{trade.t}</span>
          </div>

          {/* Quote */}
          <div style={styles.quote}>
            <span style={styles.handle}>@{trade.h}</span>
            <p style={styles.quoteText}>"{trade.c}"</p>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`freeport://t/${params.data}${ref ? `?ref=${ref}` : ''}`}
          style={styles.ctaButton}
        >
          View Trade
        </a>
        <a
          href="https://apps.apple.com/app/freeport/id6745072874"
          style={styles.ctaLink}
        >
          Get Freeport for iOS
        </a>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    backgroundColor: '#000000',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  content: {
    width: '100%',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoMark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  signalCard: {
    width: '100%',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: '24px',
    marginBottom: 32,
  },
  tradeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  actionBadge: {
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  ticker: {
    fontSize: 32,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  quote: {
    borderLeft: '2px solid #333333',
    paddingLeft: 16,
  },
  handle: {
    color: '#666666',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    display: 'block',
  },
  quoteText: {
    color: '#e5e5e5',
    fontSize: 16,
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
  ctaButton: {
    width: '100%',
    display: 'block',
    padding: '16px 24px',
    backgroundColor: '#ffffff',
    color: '#000000',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  ctaLink: {
    color: '#666666',
    fontSize: 14,
    textDecoration: 'none',
    fontWeight: 500,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#ffffff',
    marginBottom: 8,
    marginTop: 0,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
};
