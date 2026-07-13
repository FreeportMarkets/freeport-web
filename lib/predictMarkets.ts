/**
 * Server-side fetch + types for prediction markets.
 *
 * Prediction markets are identified by:
 *   - venue === 'hyperliquid' AND venue_metadata.outcome_id present (HIP-4 binary)
 *   - venue === 'kalshi'
 *
 * ISR: revalidates every 60 seconds.
 *
 * MOCK FALLBACK: when the live fetch returns zero prediction markets (the backend
 * feature is gated OFF in production today), or when
 * NEXT_PUBLIC_PREDICT_MOCK=1, a set of realistic mock markets is returned so
 * the /predict page is fully testable on this branch. Remove / disable the
 * fallback once the backend gate is lifted.
 */

const TRADING_API =
  process.env.NEXT_PUBLIC_TRADING_API ?? 'https://trading-api.freeportmarkets.com';

// ---- Minimal backend types (inline) ----------------------------------------

interface RawMarket {
  market_id: string;
  display_name?: string;
  base_asset?: string;
  venue: string;
  category?: string;
  close_time?: string | null;
  venue_metadata?: {
    outcome_id?: string;
    settlement_rule?: string;
    event_title?: string;
    market_title?: string;
    [key: string]: unknown;
  };
}

interface RawMarketStat {
  market_id: string;
  mark_price?: number; // integer cents for binary (e.g. 52 = 52%)
}

interface MarketsResponse {
  data?: { markets?: RawMarket[] };
}

interface StatsResponse {
  data?: { stats?: RawMarketStat[] };
}

// ---- Public type returned to pages -----------------------------------------

export interface PredictionMarket {
  market_id: string;
  /** Short title for the event group, e.g. "Federal Reserve June 2025" */
  eventTitle: string;
  /** The specific binary question, e.g. "Will the Fed cut rates in June?" */
  marketTitle: string;
  category: 'Fed & Rates' | 'Economy' | 'Elections' | 'Geopolitics' | 'Crypto' | 'Other';
  /** YES probability as integer 0-100. null when no stat available. */
  probabilityPct: number | null;
  closeTime: string | null;
  venue: string;
  /** Optional settlement rule text from venue_metadata */
  settlementRule?: string;
}

// ---- Category inference -----------------------------------------------------

function inferCategory(raw: RawMarket): PredictionMarket['category'] {
  const haystack =
    `${raw.category ?? ''} ${raw.venue_metadata?.event_title ?? ''} ${raw.display_name ?? ''}`.toLowerCase();

  if (/fed|fomc|rate|rates|interest/.test(haystack)) return 'Fed & Rates';
  if (/cpi|gdp|inflation|unemployment|nfp|payroll|recession|economy/.test(haystack)) return 'Economy';
  if (/elect|president|congress|senate|vote|ballot|poll/.test(haystack)) return 'Elections';
  if (/war|conflict|nato|china|taiwan|ukraine|russia|geopolit/.test(haystack)) return 'Geopolitics';
  if (/btc|bitcoin|eth|crypto|solana/.test(haystack)) return 'Crypto';
  return 'Other';
}

// ---- Prediction-market predicate -------------------------------------------

function isPredictionMarket(m: RawMarket): boolean {
  if (m.venue === 'kalshi') return true;
  if (m.venue === 'hyperliquid' && m.venue_metadata?.outcome_id) return true;
  return false;
}

// ---- TEMPORARY MOCK FALLBACK (remove once backend gate is lifted) -----------
// These represent realistic near-term binary markets for UI preview purposes.

export const MOCK_PREDICT_MARKETS: PredictionMarket[] = [
  {
    market_id: 'mock-fed-cut-sep-2025',
    eventTitle: 'Federal Reserve September 2025',
    marketTitle: 'Will the Fed cut rates at the September 2025 FOMC meeting?',
    category: 'Fed & Rates',
    probabilityPct: 42,
    closeTime: '2025-09-17T18:00:00Z',
    venue: 'kalshi',
    settlementRule:
      'Resolves YES if the Federal Open Market Committee votes to lower the federal funds rate target range at the September 16–17, 2025 meeting.',
  },
  {
    market_id: 'mock-cpi-above-3-aug-2025',
    eventTitle: 'CPI Report August 2025',
    marketTitle: 'Will US CPI year-over-year exceed 3.0% in the August 2025 report?',
    category: 'Economy',
    probabilityPct: 31,
    closeTime: '2025-09-10T12:30:00Z',
    venue: 'kalshi',
    settlementRule:
      'Resolves YES if the Bureau of Labor Statistics reports August 2025 CPI year-over-year above 3.0% (rounded to one decimal).',
  },
  {
    market_id: 'mock-btc-100k-eoy-2025',
    eventTitle: 'Bitcoin Price 2025',
    marketTitle: 'Will Bitcoin reach $100,000 by end of 2025?',
    category: 'Crypto',
    probabilityPct: 67,
    closeTime: '2025-12-31T23:59:59Z',
    venue: 'hyperliquid',
    settlementRule:
      'Resolves YES if the BTC/USD spot price on Hyperliquid reaches or exceeds $100,000 at any point before December 31, 2025 23:59 UTC.',
  },
  {
    market_id: 'mock-us-recession-2025',
    eventTitle: 'US Economy 2025',
    marketTitle: 'Will the US enter a recession in 2025?',
    category: 'Economy',
    probabilityPct: 22,
    closeTime: '2026-01-31T23:59:59Z',
    venue: 'kalshi',
    settlementRule:
      'Resolves YES if the NBER officially declares a recession beginning in calendar year 2025, as determined by their Business Cycle Dating Committee.',
  },
];

// ---- Main fetch ------------------------------------------------------------

export async function fetchPredictionMarkets(): Promise<PredictionMarket[]> {
  // Allow mock override via env
  if (process.env.NEXT_PUBLIC_PREDICT_MOCK === '1') {
    return MOCK_PREDICT_MARKETS;
  }

  try {
    const [marketsRes, statsRes] = await Promise.all([
      fetch(`${TRADING_API}/v1/markets`, { next: { revalidate: 60 } }),
      fetch(`${TRADING_API}/v1/market-stats`, { next: { revalidate: 60 } }),
    ]);

    if (!marketsRes.ok || !statsRes.ok) {
      console.warn('[predictMarkets] backend returned non-OK; using mock fallback');
      return MOCK_PREDICT_MARKETS;
    }

    const marketsJson = (await marketsRes.json()) as MarketsResponse;
    const statsJson = (await statsRes.json()) as StatsResponse;

    const allMarkets: RawMarket[] = marketsJson.data?.markets ?? [];
    const allStats: RawMarketStat[] = statsJson.data?.stats ?? [];

    const statsMap = new Map<string, number>();
    for (const s of allStats) {
      if (s.mark_price !== undefined) statsMap.set(s.market_id, s.mark_price);
    }

    const predictionMarkets = allMarkets
      .filter(isPredictionMarket)
      .map((m): PredictionMarket => {
        const rawPct = statsMap.get(m.market_id) ?? null;
        return {
          market_id: m.market_id,
          eventTitle: m.venue_metadata?.event_title ?? m.display_name ?? m.base_asset ?? m.market_id,
          marketTitle: m.venue_metadata?.market_title ?? m.display_name ?? m.market_id,
          category: inferCategory(m),
          probabilityPct: rawPct,
          closeTime: m.close_time ?? null,
          venue: m.venue,
          settlementRule: m.venue_metadata?.settlement_rule,
        };
      });

    // Use mock fallback when live fetch returns zero prediction markets
    // (backend feature is currently gated OFF in production)
    if (predictionMarkets.length === 0) {
      console.info('[predictMarkets] no live prediction markets found; using mock fallback');
      return MOCK_PREDICT_MARKETS;
    }

    return predictionMarkets;
  } catch (err) {
    console.warn('[predictMarkets] fetch error; using mock fallback:', err);
    return MOCK_PREDICT_MARKETS;
  }
}
