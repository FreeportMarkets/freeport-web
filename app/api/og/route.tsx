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
  const displayContent = content.length > 160
    ? content.slice(0, 160) + '...'
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
        {/* Image Section - Top ~70% */}
        <div
          style={{
            display: 'flex',
            height: '420px',
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
              width={260}
              height={260}
              style={{ objectFit: 'contain' }}
            />
          )}
        </div>

        {/* Text Section - Bottom ~30% */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 28px',
            backgroundColor: '#f3f4f6',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Tweet Content */}
          <p
            style={{
              fontSize: 26,
              color: '#111827',
              lineHeight: 1.35,
              margin: 0,
              marginBottom: 12,
              fontWeight: 400,
            }}
          >
            {displayContent}
          </p>

          {/* Author + Action */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, color: '#6b7280' }}>
              @{handle} · {ticker ? `${actionText} ${ticker} on Freeport` : 'Trade on Freeport'}
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
