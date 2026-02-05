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

  // If we have trade data but no image, render a trade card that looks like the app
  if (hasTradeData) {
    const isSell = action === 'SELL';
    const actionText = isSell ? 'Short' : 'Buy';
    const avatarUrl = getHandleAvatarUrl(handle, baseUrl);

    // Truncate content for readability
    const displayContent = content.length > 280
      ? content.slice(0, 280) + '...'
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
            padding: '48px 56px',
          }}
        >
          {/* Trade Card Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
            }}
          >
            {/* Header Row: Avatar + Handle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 24,
              }}
            >
              {/* Avatar */}
              <img
                src={avatarUrl}
                width={88}
                height={88}
                style={{
                  borderRadius: 44,
                  marginRight: 20,
                  objectFit: 'cover',
                }}
              />
              {/* Handle */}
              <span
                style={{
                  fontSize: 36,
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
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  color: '#E5E7EB',
                  lineHeight: 1.5,
                }}
              >
                {displayContent}
              </span>
            </div>

            {/* Buy/Short Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: '#4d91f0',
                borderStyle: 'solid',
                borderRadius: 16,
                padding: '20px 32px',
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#4d91f0',
                }}
              >
                {actionText} {ticker}
              </span>
            </div>
          </div>

          {/* Freeport Branding - Bottom Right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: 24,
            }}
          >
            <img
              src={`${baseUrl}/logo-boat.png`}
              width={36}
              height={36}
              style={{ marginRight: 12 }}
            />
            <span style={{ color: '#6B7280', fontSize: 24, fontWeight: 600 }}>
              Freeport
            </span>
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
