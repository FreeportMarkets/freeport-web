import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { HANDLE_ICONS } from '../../data/logos';

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

  // If we have trade data but no image, render a trade card
  if (hasTradeData) {
    const isSell = action === 'SELL';
    const actionText = isSell ? 'SHORT' : 'BUY';
    const actionBgColor = isSell ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)';
    const actionTextColor = isSell ? '#ef4444' : '#22c55e';
    const avatarUrl = getHandleAvatarUrl(handle, baseUrl);

    // More content for OG image - up to 400 chars
    const displayContent = content.length > 400
      ? content.slice(0, 400) + '...'
      : content;

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0A0A0B',
            padding: '40px 48px',
          }}
        >
          {/* Top Bar: Action Badge + Ticker on left, Logo on right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 32,
            }}
          >
            {/* Action Badge + Ticker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: actionBgColor,
                  padding: '8px 20px',
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: actionTextColor,
                    letterSpacing: '0.5px',
                  }}
                >
                  {actionText}
                </span>
              </div>
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                {ticker}
              </span>
            </div>

            {/* Freeport Logo - Top Right */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={`${baseUrl}/logo-boat.png`}
                width={40}
                height={40}
                style={{ marginRight: 12 }}
              />
              <span style={{ color: '#6B7280', fontSize: 24, fontWeight: 600 }}>
                Freeport
              </span>
            </div>
          </div>

          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#111113',
              borderRadius: 16,
              padding: '28px 32px',
              flex: 1,
              border: '1px solid #1F2937',
            }}
          >
            {/* Handle Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <img
                src={avatarUrl}
                width={56}
                height={56}
                style={{
                  borderRadius: 28,
                  marginRight: 16,
                  objectFit: 'cover',
                }}
              />
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                @{handle}
              </span>
            </div>

            {/* Content */}
            <div
              style={{
                display: 'flex',
                flex: 1,
                borderLeft: '3px solid #4d91f0',
                paddingLeft: 20,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  color: '#D1D5DB',
                  lineHeight: 1.45,
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
