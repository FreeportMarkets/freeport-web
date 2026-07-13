import type { Metadata } from 'next';
import { fetchPredictionMarkets, type PredictionMarket } from '../../../lib/predictMarkets';
import Header from '../../components/Header';
import PredictTradeButton from '../PredictTradeButton';

// ---- Metadata (dynamic OG) -------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: { marketId: string };
}): Promise<Metadata> {
  const marketId = decodeURIComponent(params.marketId);
  const markets = await fetchPredictionMarkets();
  const market = markets.find((m) => m.market_id === marketId);

  if (!market) {
    return {
      title: 'Prediction Market · Freeport',
      description: 'Trade prediction markets on Freeport.',
    };
  }

  const title = `${market.marketTitle} · Freeport`;
  const probStr =
    market.probabilityPct !== null ? `Currently ${market.probabilityPct}% YES.` : '';
  const description = `${probStr} Trade YES or NO in the Freeport app.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: 'Freeport',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

// ---- Helpers ----------------------------------------------------------------

function formatCloseDate(iso: string | null): string {
  if (!iso) return 'No expiry';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return iso;
  }
}

function ProbabilityDisplay({ pct }: { pct: number | null }) {
  const value = pct ?? 50;
  const yesColor = value >= 50 ? '#22c55e' : '#a1a1aa';
  const noColor = value < 50 ? '#ef4444' : '#a1a1aa';
  const noImplied = 100 - value;

  return (
    <div style={detailStyles.probBlock}>
      {/* Big YES probability */}
      <div style={detailStyles.probHero}>
        <span style={{ ...detailStyles.probBig, color: yesColor }}>
          {pct !== null ? `${pct}%` : '—'}
        </span>
        <span style={detailStyles.probHeroLabel}>YES probability</span>
      </div>

      {/* Bar */}
      <div style={detailStyles.barTrack}>
        <div
          style={{
            ...detailStyles.barFill,
            width: `${value}%`,
            backgroundColor: value >= 50 ? '#22c55e' : '#ef4444',
          }}
        />
      </div>

      {/* Implied prices */}
      <div style={detailStyles.impliedRow}>
        <div style={detailStyles.impliedCell}>
          <span style={{ ...detailStyles.impliedPrice, color: yesColor }}>
            ${(value / 100).toFixed(2)}
          </span>
          <span style={detailStyles.impliedLabel}>Implied YES</span>
        </div>
        <div style={detailStyles.impliedDivider} />
        <div style={detailStyles.impliedCell}>
          <span style={{ ...detailStyles.impliedPrice, color: noColor }}>
            ${(noImplied / 100).toFixed(2)}
          </span>
          <span style={detailStyles.impliedLabel}>Implied NO</span>
        </div>
      </div>
    </div>
  );
}

// ---- Not-found fallback UI -------------------------------------------------

function NotFoundView({ marketId }: { marketId: string }) {
  return (
    <>
      <Header activePath="/predict" />
      <main style={detailStyles.main}>
        <div style={detailStyles.notFound}>
          <p style={detailStyles.notFoundIcon}>🔍</p>
          <h1 style={detailStyles.notFoundTitle}>Market not found</h1>
          <p style={detailStyles.notFoundSub}>
            The market <code style={detailStyles.code}>{marketId}</code> could not be found.
          </p>
          <a href="/predict" style={detailStyles.backLink}>
            ← Browse all markets
          </a>
        </div>
      </main>
    </>
  );
}

// ---- Page ------------------------------------------------------------------

export default async function PredictDetailPage({
  params,
}: {
  params: { marketId: string };
}) {
  const marketId = decodeURIComponent(params.marketId);
  const markets = await fetchPredictionMarkets();
  const market: PredictionMarket | undefined = markets.find((m) => m.market_id === marketId);

  if (!market) {
    return <NotFoundView marketId={marketId} />;
  }

  return (
    <>
      <Header activePath="/predict" />

      <main style={detailStyles.main}>
        {/* Back link */}
        <a href="/predict" style={detailStyles.backNav}>
          ← Prediction Markets
        </a>

        {/* Card shell */}
        <div style={detailStyles.card}>
          {/* Venue + close date */}
          <div style={detailStyles.cardTop}>
            <span style={detailStyles.venueBadge}>{market.venue}</span>
            <span style={detailStyles.closeDate}>
              Closes {formatCloseDate(market.closeTime)}
            </span>
          </div>

          {/* Event title */}
          <p style={detailStyles.eventTitle}>{market.eventTitle}</p>

          {/* Market question */}
          <h1 style={detailStyles.marketTitle}>{market.marketTitle}</h1>

          {/* Divider */}
          <div style={detailStyles.divider} />

          {/* Probability */}
          <ProbabilityDisplay pct={market.probabilityPct} />

          {/* Settlement rule */}
          {market.settlementRule && (
            <div style={detailStyles.settlementBlock}>
              <p style={detailStyles.settlementLabel}>Settlement Rule</p>
              <p style={detailStyles.settlementText}>{market.settlementRule}</p>
            </div>
          )}

          {/* CTA */}
          <div style={detailStyles.ctaBlock}>
            <PredictTradeButton
              marketId={market.market_id}
              label="Trade in App"
              style={{ fontSize: 16, padding: '14px 32px' }}
            />
            <p style={detailStyles.ctaNote}>Opens the Freeport app · iOS &amp; Android</p>
          </div>
        </div>

        {/* App store fallback */}
        <div style={detailStyles.storeBadges}>
          <p style={detailStyles.storeBadgesLabel}>Don&apos;t have the app?</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="https://apps.apple.com/us/app/freeport-markets/id6758952978">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/badges/app-store-badge.svg"
                alt="Download on the App Store"
                style={{ width: 140, height: 'auto' }}
              />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.freeportmarkets.app">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/badges/google-play-badge.svg"
                alt="Get it on Google Play"
                style={{ width: 140, height: 'auto' }}
              />
            </a>
          </div>
        </div>
      </main>
    </>
  );
}

// ---- Styles -----------------------------------------------------------------

const detailStyles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    padding: '32px 20px 80px',
    maxWidth: 640,
    margin: '0 auto',
  },
  backNav: {
    fontSize: 14,
    color: '#71717a',
    textDecoration: 'none',
    fontWeight: 500,
    display: 'inline-block',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#18181b',
    border: '1px solid #27272a',
    borderRadius: 20,
    padding: '28px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
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
    fontSize: 22,
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
    lineHeight: 1.35,
    letterSpacing: '-0.3px',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272a',
    margin: '4px 0',
  },
  probBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  probHero: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 10,
  },
  probBig: {
    fontSize: 48,
    fontWeight: 700,
    letterSpacing: '-1px',
    lineHeight: 1,
  },
  probHeroLabel: {
    fontSize: 15,
    color: '#71717a',
  },
  barTrack: {
    height: 8,
    backgroundColor: '#27272a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  impliedRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    backgroundColor: '#27272a',
    borderRadius: 10,
    overflow: 'hidden',
  },
  impliedCell: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 0',
    gap: 2,
  },
  impliedDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#3f3f46',
    alignSelf: 'center',
  },
  impliedPrice: {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '-0.3px',
  },
  impliedLabel: {
    fontSize: 11,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 500,
  },
  settlementBlock: {
    backgroundColor: '#27272a',
    borderRadius: 10,
    padding: '14px 16px',
  },
  settlementLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    margin: '0 0 6px',
  },
  settlementText: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 1.6,
    margin: 0,
  },
  ctaBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  ctaNote: {
    fontSize: 12,
    color: '#52525b',
    margin: 0,
    textAlign: 'center',
  },
  storeBadges: {
    marginTop: 40,
    paddingTop: 32,
    borderTop: '1px solid #27272a',
  },
  storeBadgesLabel: {
    fontSize: 14,
    color: '#71717a',
    margin: '0 0 16px',
  },
  notFound: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center',
    gap: 12,
  },
  notFoundIcon: {
    fontSize: 40,
    margin: 0,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
  },
  notFoundSub: {
    fontSize: 15,
    color: '#71717a',
    margin: 0,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 13,
    backgroundColor: '#27272a',
    padding: '2px 6px',
    borderRadius: 4,
    color: '#a1a1aa',
  },
  backLink: {
    fontSize: 14,
    color: '#22c55e',
    textDecoration: 'none',
    fontWeight: 500,
    marginTop: 8,
  },
};
