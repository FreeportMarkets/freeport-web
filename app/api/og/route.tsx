import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

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
            backgroundColor: '#ffffff',
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

  // If we have trade data but no image, render a tweet-style card
  if (hasTradeData) {
    const isSell = action === 'SELL';
    const actionColor = isSell ? '#ef4444' : '#22c55e';
    const actionText = isSell ? 'SELL' : 'BUY';

    // Truncate content for the card (max ~200 chars for readability)
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
            flexDirection: 'column',
            backgroundColor: '#0a0a0a',
            padding: 60,
          }}
        >
          {/* Header: Logo + Branding */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            <img
              src={`${baseUrl}/logo-boat.png`}
              width={56}
              height={56}
              style={{ marginRight: 16 }}
            />
            <span style={{ color: '#ffffff', fontSize: 32, fontWeight: 700 }}>
              Freeport
            </span>
          </div>

          {/* Trade Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#18181b',
              borderRadius: 20,
              padding: 32,
              border: '1px solid #27272a',
              flex: 1,
            }}
          >
            {/* Action + Ticker Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
              <span
                style={{
                  color: actionColor,
                  fontSize: 24,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginRight: 16,
                }}
              >
                {actionText}
              </span>
              <span style={{ color: '#ffffff', fontSize: 28, fontWeight: 700 }}>
                {ticker}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, backgroundColor: '#27272a', marginBottom: 24 }} />

            {/* Quote Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: 20,
                borderLeft: '3px solid #3b82f6',
                flex: 1,
              }}
            >
              {/* Handle */}
              <span style={{ color: '#71767b', fontSize: 22, marginBottom: 12 }}>
                @{handle}
              </span>

              {/* Content */}
              <span
                style={{
                  color: '#e7e9ea',
                  fontSize: 26,
                  lineHeight: 1.4,
                  flex: 1,
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
