export const APP_STORE_URL = 'https://apps.apple.com/us/app/freeport-markets/id6758952978';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.freeportmarkets.app';

export type Platform = 'ios' | 'android' | 'other';
export type Store = 'ios' | 'android';

export function detectPlatform(ua: string): Platform {
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return 'ios';
  if (/android/.test(s)) return 'android';
  return 'other';
}

export function storeUrl(store: Store): string {
  return store === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
}

/**
 * Write the promo code to the clipboard for cold-install deferred attribution.
 * Returns true if a write was issued.
 *
 * Callers MUST `await` this before navigating to the store — an unawaited write
 * followed by `window.location.href = …` can be torn down before the async
 * Clipboard write commits (especially on the fast Android → Play Store handoff).
 *
 * Tries the async Clipboard API first (Chrome/Safari on https + user gesture),
 * then falls back to a hidden-textarea `execCommand('copy')` for older/embedded
 * webviews where the async API is missing or blocked. Both write the same
 * string, so this only ever helps. (For the partner cold-install flow the link
 * should still open in a real browser, not an in-app webview.)
 */
export async function writePromoToClipboard(code: string): Promise<boolean> {
  const text = `FREEPORT_PROMO:${code}`;
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* async API blocked/unavailable — fall through to legacy copy */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/**
 * Try to open the installed app via `deepLink`; if the page is still visible
 * after `delayMs` (app didn't open), send the user to the right store.
 *
 * `deepLink` MUST be a custom scheme (`freeport://…`), NOT a same-origin https
 * URL — assigning a same-origin https URL to `window.location.href` reloads the
 * current page, which cancels the fallback timer and strands the user (PR #1
 * review). A custom scheme either opens the app (page hidden → store skipped)
 * or no-ops without navigating (timer fires → store).
 *
 * Desktop / unknown platforms have no app to open and no mobile store that
 * makes sense, so we leave the user on the landing page instead of bouncing
 * them to the iOS App Store.
 */
export function openAppThenStore(deepLink: string, platform: Platform, delayMs = 1500): void {
  if (platform === 'other') return;
  window.location.href = deepLink;
  window.setTimeout(() => {
    if (!document.hidden) {
      window.location.href = platform === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
    }
  }, delayMs);
}
