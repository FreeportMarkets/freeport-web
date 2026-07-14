import type { Metadata } from 'next';
import { fetchPredictionMarkets, type PredictionMarket } from '../../lib/predictMarkets';
import Header from '../components/Header';
import PredictTradeButton from './PredictTradeButton';

export const metadata: Metadata = {
  title: 'Prediction Markets · Freeport',
  description:
    'Browse live prediction markets on the Freeport app — Fed rate decisions, economic data, crypto prices, and more. Trade YES/NO directly from your phone.',
  openGraph: {
    title: 'Prediction Markets · Freeport',
    description:
      'Browse live prediction markets — Fed cuts, CPI prints, Bitcoin prices, and more. Trade in the Freeport app.',
    siteName: 'Freeport',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Prediction Markets · Freeport',
    description:
      'Browse live prediction markets and trade YES/NO in the Freeport app.',
  },
};

// ---- Category ordering + labels --------------------------------------------

const CATEGORY_ORDER: PredictionMarket['category'][] = [
  'Fed & Rates',
  'Economy',
  'Elections',
  'Geopolitics',
  'Crypto',
  'Other',
];

// ---- Helpers ----------------------------------------------------------------

function formatCloseDate(iso: string | null): string {
  if (!iso) return 'No expiry';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return iso;
  }
}

function ProbabilityBar({ pct }: { pct: number | null }) {
  const value = pct ?? 50;
  const barColor = value >= 50 ? '#22c55e' : '#ef4444';
  const labelColor = value >= 50 ? '#22c55e' : '#ef4444';

  return (
    <div>
      {/* Label row */}
      <div style={styles.probRow}>
        <span style={{ ...styles.probLabel, color: labelColor }}>
          {pct !== null ? `${pct}%` : '—'}
        </span>
        <span style={styles.probMuted}>YES probability</span>
      </div>
      {/* Bar */}
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${value}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
      {/* YES / NO ends */}
      <div style={styles.barEnds}>
        <span style={styles.barEndLabel}>YES</span>
        <span style={styles.barEndLabel}>NO</span>
      </div>
    </div>
  );
}

function MarketCard({ market }: { market: PredictionMarket }) {
  return (
    <div style={styles.card}>
      {/* Venue badge */}
      <div style={styles.cardTop}>
        <span style={styles.venueBadge}>{market.venue}</span>
        <span style={styles.closeDate}>Closes {formatCloseDate(market.closeTime)}</span>
      </div>

      {/* Event title */}
      <p style={styles.eventTitle}>{market.eventTitle}</p>

      {/* Market question */}
      <h3 style={styles.marketTitle}>{market.marketTitle}</h3>

      {/* Probability bar */}
      <ProbabilityBar pct={market.probabilityPct} />

      {/* CTA */}
      <div style={styles.cardFooter}>
        <PredictTradeButton marketId={market.market_id} />
        <a href={`/predict/${encodeURIComponent(market.market_id)}`} style={styles.detailLink}>
          Details →
        </a>
      </div>
    </div>
  );
}

// ---- Page ------------------------------------------------------------------

export default async function PredictPage() {
  const markets = await fetchPredictionMarkets();

  // Group by category, preserving order
  const grouped = new Map<PredictionMarket['category'], PredictionMarket[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const m of markets) {
    const list = grouped.get(m.category) ?? grouped.get('Other')!;
    list.push(m);
  }

  const nonEmptyGroups = CATEGORY_ORDER.filter((cat) => (grouped.get(cat)?.length ?? 0) > 0);

  return (
    <>
      <Header activePath="/predict" />

      <main style={styles.main}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Prediction Markets</h1>
          <p style={styles.pageSubtitle}>
            Trade YES or NO on real-world outcomes. Open the Freeport app to place orders.
          </p>
        </div>

        {/* Market groups */}
        {nonEmptyGroups.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No markets available right now. Check back soon.</p>
          </div>
        ) : (
          nonEmptyGroups.map((cat) => (
            <section key={cat} style={styles.section}>
              <h2 style={styles.sectionTitle}>{cat}</h2>
              <div style={styles.grid}>
                {grouped.get(cat)!.map((m) => (
                  <MarketCard key={m.market_id} market={m} />
                ))}
              </div>
            </section>
          ))
        )}

        {/* App CTA footer */}
        <div style={styles.appCtaBanner}>
          <div style={styles.appCtaInner}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-boat.png" alt="Freeport" width={40} height={40} style={{ objectFit: 'contain', borderRadius: 8, backgroundColor: '#fff', padding: 4 }} />
            <div>
              <p style={styles.appCtaTitle}>Trade prediction markets in the app</p>
              <p style={styles.appCtaSub}>Available on iOS and Android</p>
            </div>
            <a
              href="https://apps.apple.com/us/app/freeport-markets/id6758952978"
              style={styles.storeLink}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/badges/app-store-badge.svg" alt="Download on the App Store" style={{ width: 130, height: 'auto' }} />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

// ---- Styles -----------------------------------------------------------------

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '40px 20px 80px',
    maxWidth: 960,
    margin: '0 auto',
  },
  pageHeader: {
    marginBottom: 40,
  },
  pageTitle: {
    fontSize: 36,
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 12px',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    margin: 0,
    lineHeight: 1.5,
    maxWidth: 480,
  },
  section: {
    marginBottom: 48,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '0 0 16px',
    paddingBottom: 8,
    borderBottom: '1px solid #27272a',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  card: {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  venueBadge: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#a1a1aa',
    backgroundColor: '#27272a',
    padding: '3px 8px',
    borderRadius: 4,
  },
  closeDate: {
    fontSize: 12,
    color: '#52525b',
  },
  eventTitle: {
    fontSize: 12,
    color: '#71717a',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 500,
  },
  marketTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.4,
  },
  probRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 6,
  },
  probLabel: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '-0.5px',
  },
  probMuted: {
    fontSize: 12,
    color: '#52525b',
  },
  barTrack: {
    height: 6,
    backgroundColor: '#27272a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  barEnds: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  barEndLabel: {
    fontSize: 11,
    color: '#52525b',
    fontWeight: 500,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 4,
  },
  detailLink: {
    fontSize: 13,
    color: '#71717a',
    textDecoration: 'none',
    fontWeight: 500,
  },
  emptyState: {
    padding: '60px 0',
    textAlign: 'center',
  },
  emptyText: {
    color: '#52525b',
    fontSize: 15,
  },
  appCtaBanner: {
    marginTop: 60,
    borderTop: '1px solid #27272a',
    paddingTop: 40,
  },
  appCtaInner: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  appCtaTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    margin: '0 0 4px',
  },
  appCtaSub: {
    fontSize: 13,
    color: '#71717a',
    margin: 0,
  },
  storeLink: {
    display: 'inline-block',
    marginLeft: 'auto',
  },
};
