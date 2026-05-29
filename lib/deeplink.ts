export const APP_STORE_URL = 'https://apps.apple.com/us/app/freeport-markets/id6758952978';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.freeportmarkets.app';
export const PLAY_INTENT_URL = 'market://details?id=com.freeportmarkets.app';

export type Platform = 'ios' | 'android' | 'other';

export function detectPlatform(ua: string): Platform {
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return 'ios';
  if (/android/.test(s)) return 'android';
  return 'other';
}

export async function writePromoToClipboard(code: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(`FREEPORT_PROMO:${code}`);
  } catch {
    /* best-effort */
  }
}

export function openAppThenStore(deepLink: string, platform: Platform, delayMs = 1500): void {
  window.location.href = deepLink;
  window.setTimeout(() => {
    if (!document.hidden) {
      window.location.href = platform === 'android' ? PLAY_STORE_URL : APP_STORE_URL;
    }
  }, delayMs);
}
