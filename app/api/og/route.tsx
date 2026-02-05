import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const action = searchParams.get('a') || 'BUY';
  const ticker = searchParams.get('t') || 'BTC';
  const handle = searchParams.get('h') || 'trader';
  const content = searchParams.get('c') || '';

  const actionText = action === 'SELL' ? 'Sell' : 'Buy';
  const actionColor = action === 'SELL' ? '#ef4444' : '#22c55e';
  const actionEmoji = action === 'SELL' ? '📉' : '📈';

  // Truncate content for display
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
          backgroundColor: '#0d0d0e',
          padding: 60,
        }}
      >
        {/* Action Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{ fontSize: 48 }}>{actionEmoji}</span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: actionColor,
            }}
          >
            {actionText} {ticker}
          </span>
        </div>

        {/* Quote Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 40,
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: 28,
              color: '#4d91f0',
              fontWeight: 600,
            }}
          >
            @{handle}
          </span>
          <p
            style={{
              fontSize: 36,
              color: '#e5e7eb',
              lineHeight: 1.4,
              marginTop: 16,
            }}
          >
            "{displayContent}"
          </p>
        </div>

        {/* Footer Branding */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #374151',
            paddingTop: 24,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#ffffff',
            }}
          >
            Freeport
          </span>
          <span
            style={{
              fontSize: 24,
              color: '#6b7280',
            }}
          >
            freeport.app
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
