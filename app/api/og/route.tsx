import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const action = searchParams.get('a') || 'BUY';
  const ticker = searchParams.get('t') || '';
  const handle = searchParams.get('h') || 'trader';
  const content = searchParams.get('c') || '';
  const imageUrl = searchParams.get('i') || '';

  const isSell = action === 'SELL';
  const actionText = isSell ? 'Sell' : 'Buy';
  const hasImage = imageUrl && imageUrl.length > 0;
  const logoUrl = new URL('/logo-boat.png', request.url).toString();

  // Truncate content
  const displayContent = content.length > 180
    ? content.slice(0, 180) + '...'
    : content;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#1a2634',
        }}
      >
        {/* Image Section - Top */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            backgroundColor: hasImage ? '#000000' : '#1a2634',
          }}
        >
          {hasImage ? (
            <img
              src={imageUrl}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                width: 200,
                height: 200,
                borderRadius: 40,
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={logoUrl}
                width={130}
                height={130}
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Text Section - Bottom (embedded in image like X) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 32px',
            backgroundColor: '#1a2634',
            borderTop: hasImage ? 'none' : 'none',
          }}
        >
          {/* Tweet Content */}
          <p
            style={{
              fontSize: 28,
              color: '#ffffff',
              lineHeight: 1.4,
              margin: 0,
              marginBottom: 16,
            }}
          >
            {displayContent || 'Trade on Freeport'}
          </p>

          {/* Author + Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8' }}>
                {handle.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 18, color: '#e2e8f0', fontWeight: 600 }}>
                @{handle}
              </span>
              <span style={{ fontSize: 16, color: '#64748b' }}>
                {ticker ? `${actionText} ${ticker} on Freeport` : 'Trade on Freeport'}
              </span>
            </div>
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
