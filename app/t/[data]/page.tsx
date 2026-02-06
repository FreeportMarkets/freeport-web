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

  // Simple og:title for iMessage preview
  const title = trade.i
    ? `${action} ${trade.t} · @${trade.h} on Freeport`  // Has image - show action
    : `Trade @${trade.h} signals on Freeport`;          // No image - simple CTA
  const description = 'Trade real-time signals';

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

      {/* Trade Card */}
      <div style={styles.tradeCard}>
        {/* Header: Action + Token */}
        <div style={styles.cardHeader}>
          <span style={{
            ...styles.actionText,
            color: isSell ? '#ef4444' : '#22c55e',
          }}>
            {action}
          </span>
          <img
            src={tokenLogo}
            alt={trade.t}
            width={24}
            height={24}
            style={{ borderRadius: 12, objectFit: 'cover' }}
          />
          <span style={styles.ticker}>{trade.t}</span>
        </div>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Quote */}
        <div style={styles.quoteSection}>
          <div style={styles.handleRow}>
            <img
              src={handleAvatar}
              alt={trade.h}
              width={28}
              height={28}
              style={{ borderRadius: 14, objectFit: 'cover' }}
            />
            <span style={styles.handle}>@{trade.h}</span>
          </div>
          <p style={styles.content}>{trade.c}</p>
        </div>

      </div>

      {/* CTA */}
      <ViewTradeButton deepLink={`freeport://t/${params.data}${ref ? `?ref=${ref}` : ''}`} />

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
    marginBottom: 28,
    marginTop: 0,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 1.5,
  },
  tradeCard: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 20,
    maxWidth: 360,
    width: '100%',
    marginBottom: 28,
    border: '1px solid #27272a',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    fontWeight: 600,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  ticker: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    margin: '16px 0',
  },
  quoteSection: {
    paddingLeft: 12,
    borderLeft: '2px solid #3b82f6',
  },
  handleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  handle: {
    color: '#71767b',
    fontSize: 14,
    fontWeight: 500,
  },
  content: {
    color: '#e7e9ea',
    fontSize: 15,
    lineHeight: 1.5,
    margin: 0,
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
