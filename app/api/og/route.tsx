import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const action = searchParams.get('a') || 'BUY';
  const ticker = searchParams.get('t') || 'BTC';
  const handle = searchParams.get('h') || 'trader';
  const content = searchParams.get('c') || '';

  const isSell = action === 'SELL';
  const actionText = isSell ? 'Sell' : 'Buy';

  // Truncate content for display
  const displayContent = content.length > 160
    ? content.slice(0, 160) + '...'
    : content;

  // Fetch logo
  const logoUrl = new URL('/logo.png', request.url).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          padding: 0,
        }}
      >
        {/* Main Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            margin: 32,
            padding: 40,
            backgroundColor: '#16181c',
            borderRadius: 16,
            border: '1px solid #2f3336',
          }}
        >
          {/* Header: Logo + Action + Ticker */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            {/* Freeport Logo */}
            <img
              src={logoUrl}
              width={48}
              height={48}
              style={{
                marginRight: 16,
                borderRadius: 8,
              }}
            />
            {/* Action Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 20px',
                borderRadius: 8,
                backgroundColor: isSell ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                marginRight: 16,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: isSell ? '#ef4444' : '#22c55e',
                }}
              >
                {actionText}
              </span>
            </div>
            {/* Ticker */}
            <span
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: '#e7e9ea',
              }}
            >
              {ticker}
            </span>
          </div>

          {/* Quote Section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              paddingLeft: 20,
              borderLeft: '3px solid #2f3336',
            }}
          >
            {/* Handle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {/* Avatar placeholder */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: '#2f3336',
                  marginRight: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 18, color: '#71767b' }}>
                  {handle.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontSize: 24,
                  color: '#71767b',
                  fontWeight: 500,
                }}
              >
                @{handle}
              </span>
            </div>

            {/* Content */}
            <p
              style={{
                fontSize: 32,
                color: '#e7e9ea',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              {displayContent}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid #2f3336',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: '#e7e9ea',
                  letterSpacing: '-0.5px',
                }}
              >
                Freeport
              </span>
            </div>
            <span
              style={{
                fontSize: 20,
                color: '#71767b',
              }}
            >
              Trade on Freeport →
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
