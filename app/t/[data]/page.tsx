import type { Metadata } from 'next';
import { getTokenLogoUrl, getHandleIconUrl, getPlaceholderAvatar, getTickerPlaceholder } from '../../data/logos';
import ViewTradeButton from './ViewTradeButton';

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

  // OG image - pass all trade data so we can render a tweet card if no image
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://share.freeportmarkets.com';
  const ogParams = new URLSearchParams();
  if (trade.i) ogParams.set('i', trade.i);
  ogParams.set('h', trade.h);
  ogParams.set('c', trade.c);
  ogParams.set('a', trade.a);
  ogParams.set('t', trade.t);
  const ogImageUrl = `${baseUrl}/api/og?${ogParams.toString()}`;

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
        <div style={styles.brandingSmall}>
          <img src="/logo-boat.png" alt="Freeport" width={32} height={32} style={{ objectFit: 'contain' }} />
          <span style={styles.brandName}>Freeport</span>
        </div>
        <p style={styles.errorText}>Trade not found</p>
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
      {/* Trade Card - Hero */}
      <div style={styles.tradeCard}>
        {/* Action Badge + Token */}
        <div style={styles.cardTop}>
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
        </div>

        {/* Token Logo + Ticker - Centered */}
        <div style={styles.tokenSection}>
          <img
            src={tokenLogo}
            alt={trade.t}
            width={64}
            height={64}
            style={{ borderRadius: 32, objectFit: 'cover', border: '2px solid #27272a' }}
          />
          <span style={styles.ticker}>{trade.t}</span>
        </div>

        {/* Quote Block */}
        <div style={styles.quoteBlock}>
          <div style={styles.handleRow}>
            <img
              src={handleAvatar}
              alt={trade.h}
              width={32}
              height={32}
              style={{ borderRadius: 16, objectFit: 'cover' }}
            />
            <span style={styles.handle}>@{trade.h}</span>
          </div>
          <p style={styles.content}>{trade.c}</p>
        </div>

        {/* CTA inside card */}
        <ViewTradeButton deepLink={`freeport://t/${params.data}${ref ? `?ref=${ref}` : ''}`} />
      </div>

      {/* Branding at bottom */}
      <div style={styles.branding}>
        <img src="/logo-boat.png" alt="Freeport" width={28} height={28} style={{ objectFit: 'contain' }} />
        <div style={styles.brandText}>
          <span style={styles.brandName}>Freeport</span>
          <span style={styles.tagline}>Trade real-time signals</span>
        </div>
      </div>
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
  tradeCard: {
    backgroundColor: '#18181b',
    borderRadius: 24,
    padding: 28,
    maxWidth: 400,
    width: '100%',
    border: '1px solid #27272a',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionBadge: {
    padding: '8px 20px',
    borderRadius: 20,
  },
  actionText: {
    fontWeight: 700,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  tokenSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  ticker: {
    fontSize: 28,
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.5px',
  },
  quoteBlock: {
    backgroundColor: '#0f0f10',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeft: '3px solid #3b82f6',
  },
  handleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  handle: {
    color: '#71767b',
    fontSize: 15,
    fontWeight: 500,
  },
  content: {
    color: '#e7e9ea',
    fontSize: 16,
    lineHeight: 1.6,
    margin: 0,
  },
  branding: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
  },
  brandingSmall: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 700,
  },
  tagline: {
    color: '#71767b',
    fontSize: 14,
  },
  errorText: {
    color: '#a1a1aa',
    fontSize: 18,
    marginBottom: 24,
  },
  ctaButton: {
    padding: '16px 40px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 17,
  },
};
