import type { Metadata } from 'next';
import { getTokenLogoUrl, getHandleIconUrl, getPlaceholderAvatar, getTickerPlaceholder } from '../../data/logos';

// Trade data encoded in URL
interface TradeData {
  a: string;  // action: BUY or SELL
  t: string;  // ticker
  h: string;  // handle
  c: string;  // content
  i?: string; // image URL (optional)
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

  // Truncate content for OG title (iMessage limit ~90 chars)
  const handleLineLength = trade.h.length + trade.t.length + 20;
  const maxOgContent = Math.max(30, 85 - handleLineLength);
  const ogContent = trade.c.length > maxOgContent
    ? trade.c.slice(0, maxOgContent) + '...'
    : trade.c;

  // og:title for iMessage preview - truncated
  const title = `${ogContent}\n@${trade.h} · ${action} ${trade.t} on Freeport`;
  const description = 'Trade smarter with Freeport';

  // OG image is just the visual (logo or trade image)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://share.freeportmarkets.com';
  let ogImageUrl = `${baseUrl}/api/og`;
  if (trade.i) {
    ogImageUrl += `?i=${encodeURIComponent(trade.i)}`;
  }

  return {
    title,
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
        <div style={styles.logoBox}>
          <img src="/logo-boat.png" alt="Freeport" width={56} height={56} style={{ objectFit: 'contain' }} />
        </div>
        <h1 style={styles.title}>Freeport</h1>
        <p style={styles.subtitle}>Trade not found</p>
        <a href="https://apps.apple.com/app/freeport/id6745072874" style={styles.ctaButton}>
          Download on iOS
        </a>
      </div>
    );
  }

  const isSell = trade.a === 'SELL';
  const action = isSell ? 'Sell' : 'Buy';

  // Get logos (with fallback to placeholder)
  const tokenLogo = getTokenLogoUrl(trade.t) || getTickerPlaceholder(trade.t);
  const handleAvatar = getHandleIconUrl(trade.h) || getPlaceholderAvatar(trade.h);

  return (
    <div style={styles.container}>
      {/* Logo */}
      <div style={styles.logoBox}>
        <img src="/logo-boat.png" alt="Freeport" width={56} height={56} style={{ objectFit: 'contain' }} />
      </div>

      {/* Title + Slogan */}
      <h1 style={styles.title}>Freeport</h1>
      <p style={styles.subtitle}>Trade smarter with real-time signals</p>

      {/* Action + Token */}
      <div style={styles.tradeRow}>
        <span style={{
          ...styles.actionBadge,
          backgroundColor: isSell ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          color: isSell ? '#ef4444' : '#22c55e',
        }}>
          {action}
        </span>
        <img
          src={tokenLogo}
          alt={trade.t}
          width={32}
          height={32}
          style={{ borderRadius: 16, objectFit: 'cover' }}
        />
        <span style={styles.ticker}>{trade.t}</span>
      </div>

      {/* Tweet Quote */}
      <div style={styles.quoteBox}>
        <div style={styles.handleRow}>
          <img
            src={handleAvatar}
            alt={trade.h}
            width={36}
            height={36}
            style={{ borderRadius: 18, objectFit: 'cover' }}
          />
          <span style={styles.handle}>@{trade.h}</span>
        </div>
        <p style={styles.content}>{trade.c}</p>
      </div>

      {/* Trade Image (if present) */}
      {trade.i && (
        <div style={styles.imageContainer}>
          <img
            src={trade.i}
            alt="Trade"
            style={styles.tradeImage}
          />
        </div>
      )}

      {/* CTA */}
      <a
        href={`freeport://t/${params.data}${ref ? `?ref=${ref}` : ''}`}
        style={styles.ctaButton}
      >
        View Trade
      </a>

      <p style={styles.footer}>
        Available on the App Store
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0a0a0a',
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    padding: 12,
  },
  title: {
    fontSize: 48,
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: 12,
    marginTop: 0,
    letterSpacing: '-1px',
  },
  subtitle: {
    color: '#a1a1aa',
    fontSize: 18,
    marginBottom: 32,
    marginTop: 0,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 1.5,
  },
  tradeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  actionBadge: {
    padding: '8px 16px',
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 16,
  },
  ticker: {
    fontSize: 28,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  quoteBox: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 20,
    maxWidth: 360,
    width: '100%',
    marginBottom: 24,
    borderLeft: '3px solid #3b82f6',
  },
  handleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  handle: {
    color: '#71767b',
    fontSize: 15,
    fontWeight: 500,
  },
  content: {
    color: '#e7e9ea',
    fontSize: 16,
    lineHeight: 1.5,
    margin: 0,
  },
  imageContainer: {
    maxWidth: 360,
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tradeImage: {
    width: '100%',
    maxHeight: 200,
    objectFit: 'cover',
  },
  ctaButton: {
    padding: '16px 40px',
    backgroundColor: '#1d9bf0',
    color: '#fff',
    borderRadius: 9999,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 17,
  },
  footer: {
    marginTop: 56,
    color: '#52525b',
    fontSize: 13,
  },
};
