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
  const displayContent = content.length > 150
    ? content.slice(0, 150) + '...'
    : content || 'Trade on Freeport';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Image Section - Top */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
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
            <img
              src={logoUrl}
              width={280}
              height={280}
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Text Section - Bottom (dark blue like X in dark mode) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 28px',
            backgroundColor: '#1a2634',
            minHeight: '200px',
          }}
        >
          {/* Tweet Content */}
          <p
            style={{
              fontSize: 28,
              color: '#ffffff',
              lineHeight: 1.4,
              margin: 0,
              marginBottom: 20,
              fontWeight: 400,
            }}
          >
            {displayContent}
          </p>

          {/* Author Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 600, color: '#94a3b8' }}>
                {handle.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 18, color: '#ffffff', fontWeight: 600 }}>
                @{handle}
              </span>
              <span style={{ fontSize: 16, color: '#94a3b8' }}>
                {ticker ? `${actionText} ${ticker} on Freeport` : 'Trade on Freeport'}
              </span>
            </div>
          </div>

          {/* Domain */}
          <span style={{ fontSize: 16, color: '#60a5fa' }}>
            share.freeportmarkets.com
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
