# HIP-4 Predict Web — Design Spec
**Date:** 2026-07-13  
**Branch:** `feat/hip4-predict-web`  
**Status:** Implemented (browse-only, mock fallback active)

---

## Overview

Browse-only Prediction Markets section on the Freeport marketing/deeplink website (`freeport-web`, Next.js 14 App Router). No auth, no wallet, no trading on the web. All trading is deeplinked to the native app via `freeport://predict/<market_id>`.

---

## Routes Added

| Route | Type | Description |
|---|---|---|
| `/predict` | Static (ISR 60s) | Market list grouped by category |
| `/predict/[marketId]` | Dynamic server | Detail page for one market |

---

## Data Layer — `lib/predictMarkets.ts`

### Backend endpoints consumed
- `GET /v1/markets` — full market catalog (`NormalizedMarket[]`)
- `GET /v1/market-stats` — live stats including `mark_price` (integer cents for binaries)

Both fetched in parallel with `next: { revalidate: 60 }` (ISR, 60-second freshness).

### Prediction market filter
A market is a prediction market if:
- `venue === 'kalshi'`, OR
- `venue === 'hyperliquid'` AND `venue_metadata.outcome_id` is present (HIP-4 binary)

### Output type: `PredictionMarket`
```ts
{
  market_id: string;
  eventTitle: string;        // from venue_metadata.event_title or display_name
  marketTitle: string;       // the binary question
  category: 'Fed & Rates' | 'Economy' | 'Elections' | 'Geopolitics' | 'Crypto' | 'Other';
  probabilityPct: number | null; // from mark_price (cents), null if no stat
  closeTime: string | null;
  venue: string;
  settlementRule?: string;   // from venue_metadata.settlement_rule
}
```

### Mock fallback (temporary)
The backend feature flag for HIP-4 prediction markets is **currently OFF** in production. When the live fetch returns zero prediction markets, `MOCK_PREDICT_MARKETS` (4 realistic markets: Fed cut, CPI print, BTC $100k, US recession) is returned instead. Also activated by `NEXT_PUBLIC_PREDICT_MOCK=1`.

**Remove the fallback once the backend gate is lifted and live markets appear.**

---

## UI Components

### `app/components/Header.tsx`
Minimal sticky site header: Freeport wordmark (→ `/`) + "Predict" nav link (→ `/predict`). Dark, inline-style, `backdrop-filter: blur(12px)`. Added to `/predict` and `/predict/[marketId]` pages only (homepage doesn't need it).

### `app/predict/PredictTradeButton.tsx` (client component)
Mirrors `ViewTradeButton` pattern. On click: `openAppThenStore(freeport://predict/<market_id>, platform)`. Falls back to App Store / Play Store if app not installed. Green pill CTA (`#22c55e` fill, black text).

### `/predict` — list page
- Groups markets by category in fixed order: Fed & Rates → Economy → Elections → Geopolitics → Crypto → Other
- Card per market: venue badge, event title, market question, probability bar (% + colored bar), close date, "Trade in App" button + "Details →" link
- Empty state when no markets
- App Store CTA banner at bottom

### `/predict/[marketId]` — detail page
- Big probability display (48pt), bar, implied YES/NO prices ($0.XX format from pct/100)
- Settlement rule block if present
- Prominent "Trade in App" CTA (green pill)
- App Store / Play Store badge fallback for non-app users
- 404-style fallback UI if `market_id` not found in the list

---

## Deeplink scheme

`freeport://predict/<market_id>`

The mobile app is expected to handle this scheme and route to the prediction market trade UI. The web site sends this intent; routing logic lives in the app.

---

## Styling conventions
- Inline `React.CSSProperties` only (no Tailwind/CSS modules)
- Dark theme: bg `#0a0a0a`, cards `#18181b`, borders `#27272a`, text `#ffffff`
- Green `#22c55e` (YES/positive), red `#ef4444` (NO/negative), muted `#a1a1aa` / `#71717a`
- Card border-radius 16px (list), 20px (detail)

---

## Testing

```bash
# Dev with mock fallback (no backend needed)
NEXT_PUBLIC_PREDICT_MOCK=1 npm run dev
# then visit http://localhost:3000/predict

# Production build verification
npm run build   # should complete with zero errors

# Type check only
npx tsc --noEmit
```

The mock fallback also activates automatically when the backend returns 0 prediction markets, so `npm run dev` (without the env var) will also show the mock markets until the backend gate is lifted.

---

## What to do when backend goes live

1. Confirm `GET /v1/markets` returns markets with `venue_metadata.outcome_id` (HIP-4) or `venue === 'kalshi'`.
2. Remove `MOCK_PREDICT_MARKETS` constant and the zero-markets fallback check in `lib/predictMarkets.ts` (the `try/catch` error fallback can remain for resilience).
3. Verify the `mark_price` field in `/v1/market-stats` returns integer cents for binary markets.
4. Test detail pages with real `market_id` values.
