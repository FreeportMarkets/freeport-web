import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { HANDLE_ICONS, TOKEN_LOGOS } from '../../data/logos';

export const runtime = 'edge';

function getHandleAvatarUrl(handle: string, baseUrl: string): string {
  const normalized = handle.replace('@', '').toLowerCase();
  const path = HANDLE_ICONS[normalized];
  if (path) {
    return `${baseUrl}${path}`;
  }
  // Fallback to UI avatars
  const initial = handle.replace('@', '').charAt(0).toUpperCase();
  return `https://ui-avatars.com/api/?name=${initial}&background=4d91f0&color=fff&size=88&bold=true`;
}

function getTokenLogoUrl(ticker: string, baseUrl: string): string | null {
  if (!ticker) return null;
  const upper = ticker.toUpperCase();

  if (TOKEN_LOGOS[upper]) return `${baseUrl}${TOKEN_LOGOS[upper]}`;

  // Try stripping "ON" suffix (Ondo tokens)
  if (upper.endsWith('ON') && upper.length > 2) {
    const withoutOn = upper.slice(0, -2);
    if (TOKEN_LOGOS[withoutOn]) return `${baseUrl}${TOKEN_LOGOS[withoutOn]}`;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const baseUrl = new URL(request.url).origin;

  // Get trade data from params
  const imageUrl = searchParams.get('i') || '';
  const handle = searchParams.get('h') || '';
  const content = searchParams.get('c') || '';
  const action = searchParams.get('a') || 'BUY';
  const ticker = searchParams.get('t') || '';

  const hasImage = imageUrl && imageUrl.length > 0;
  const hasTradeData = handle && content;

  // If we have an image from the tweet, show it
  if (hasImage) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0A0A0B',
          }}
        >
          <img
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // If we have trade data but no image, render a clean side-by-side preview
  // REVERT NOTE: This is the side-by-side layout with full token logo on left,
  // action+ticker+handle+content on right. No tagline text.
  if (hasTradeData) {
    const isSell = action === 'SELL';
    const actionText = isSell ? 'SELL' : 'BUY';
    const actionColor = isSell ? '#ef4444' : '#22c55e';
    const actionBg = isSell ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
    const avatarUrl = getHandleAvatarUrl(handle, baseUrl);
    const tokenLogoUrl = getTokenLogoUrl(ticker, baseUrl);

    // Truncate content for readability
    const displayContent = content.length > 200
      ? content.slice(0, 200) + '...'
      : content;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundColor: '#0A0A0B',
          }}
        >
          {/* Left: Full Token Logo Panel - black background */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 420,
              backgroundColor: '#0A0A0B',
            }}
          >
            {tokenLogoUrl ? (
              <img
                src={tokenLogoUrl}
                width={320}
                height={320}
                style={{
                  borderRadius: 160,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: 320,
                  height: 320,
                  borderRadius: 160,
                  backgroundColor: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 80, fontWeight: 700, color: '#9ca3af' }}>
                  {ticker.slice(0, 3)}
                </span>
              </div>
            )}
          </div>

          {/* Right: Action + Handle + Content - more vertical space */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              padding: '48px 56px',
              justifyContent: 'center',
            }}
          >
            {/* Action Badge + Ticker */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: actionBg,
                  padding: '12px 28px',
                  borderRadius: 8,
                  marginRight: 24,
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: actionColor,
                    letterSpacing: '1px',
                  }}
                >
                  {actionText}
                </span>
              </div>
              <span
                style={{
                  fontSize: 52,
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}
              >
                {ticker}
              </span>
            </div>

            {/* Handle */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
              <img
                src={avatarUrl}
                width={56}
                height={56}
                style={{ borderRadius: 28, marginRight: 16, objectFit: 'cover' }}
              />
              <span style={{ fontSize: 32, fontWeight: 600, color: '#9ca3af' }}>
                @{handle}
              </span>
            </div>

            {/* Tweet Content - larger text */}
            <div
              style={{
                display: 'flex',
                borderLeft: '4px solid #3b82f6',
                paddingLeft: 24,
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  color: '#e5e7eb',
                  lineHeight: 1.5,
                }}
              >
                {displayContent}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Fallback: just show the logo
  const logoUrl = `${baseUrl}/logo-boat.png`;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <img
          src={logoUrl}
          width={400}
          height={400}
          style={{ objectFit: 'contain' }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
