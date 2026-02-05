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
  const actionText = isSell ? 'SELL' : 'BUY';

  // Truncate content for display - shorter for cleaner look
  const displayContent = content.length > 140
    ? content.slice(0, 140) + '...'
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
          padding: 48,
        }}
      >
        {/* Top Bar - Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 32,
          }}
        >
          {/* Logo mark - simple F in circle */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              backgroundColor: '#1d9bf0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              F
            </span>
          </div>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            Freeport
          </span>
        </div>

        {/* Main Content Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#141414',
            borderRadius: 24,
            padding: 40,
            border: '1px solid #262626',
          }}
        >
          {/* Action + Ticker Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            {/* Action Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 28px',
                borderRadius: 12,
                backgroundColor: isSell ? '#3d1515' : '#0d3320',
                marginRight: 20,
              }}
            >
              <span
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: isSell ? '#f87171' : '#4ade80',
                  letterSpacing: '1px',
                }}
              >
                {actionText}
              </span>
            </div>
            {/* Ticker */}
            <span
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-1px',
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
              paddingLeft: 24,
              borderLeft: '4px solid #3b82f6',
            }}
          >
            {/* Handle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#262626',
                  marginRight: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 600, color: '#a1a1aa' }}>
                  {handle.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                style={{
                  fontSize: 26,
                  color: '#a1a1aa',
                  fontWeight: 500,
                }}
              >
                @{handle}
              </span>
            </div>

            {/* Content */}
            <p
              style={{
                fontSize: 34,
                color: '#e4e4e7',
                lineHeight: 1.45,
                margin: 0,
                fontWeight: 400,
              }}
            >
              "{displayContent}"
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 28,
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: '#71717a',
              fontWeight: 500,
            }}
          >
            Tap to view trade on Freeport
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
