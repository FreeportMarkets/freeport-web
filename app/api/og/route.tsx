import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const action = searchParams.get('a') || 'BUY';
  const ticker = searchParams.get('t') || 'BTC';
  const handle = searchParams.get('h') || 'trader';
  const content = searchParams.get('c') || '';
  const imageUrl = searchParams.get('i') || '';

  const isSell = action === 'SELL';
  const actionText = isSell ? 'Sell' : 'Buy';

  // Truncate content for display
  const displayContent = content.length > 160
    ? content.slice(0, 160) + '...'
    : content;

  const hasImage = imageUrl && imageUrl.length > 0;
  // Default to boat logo if no image
  const displayImage = hasImage ? imageUrl : new URL('/logo-boat.png', request.url).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
        }}
      >
        {/* Image Section - Top */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            backgroundColor: hasImage ? '#0a0a0a' : '#111111',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {hasImage ? (
            <img
              src={displayImage}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            /* Default: Centered boat logo */
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 24,
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <img
                  src={displayImage}
                  width={80}
                  height={80}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{ fontSize: 36, fontWeight: 700, color: '#ffffff' }}>
                Freeport
              </span>
            </div>
          )}
        </div>

        {/* Text Section - Bottom (X-style blue-gray) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '28px 36px',
            backgroundColor: '#1e2a3a',
          }}
        >
          {/* Tweet Content */}
          <p
            style={{
              fontSize: 28,
              color: '#ffffff',
              lineHeight: 1.4,
              margin: 0,
              marginBottom: 12,
              fontWeight: 400,
            }}
          >
            {displayContent}
          </p>

          {/* Trade on Freeport */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 20,
                color: '#94a3b8',
                fontWeight: 500,
              }}
            >
              Trade on Freeport
            </span>
          </div>

          {/* Buy/Sell Asset on Freeport */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: 18,
                color: '#64748b',
                fontWeight: 400,
              }}
            >
              {actionText} {ticker} on Freeport
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
