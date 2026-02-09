import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;

  const logoUrls = [
    `${baseUrl}/logos/tokens/anthrp.png`,
    `${baseUrl}/logos/tokens/spacex.png`,
    `${baseUrl}/logos/tokens/openai.png`,
    `${baseUrl}/logos/tokens/kalshi.png`,
  ];

  const companyNames = ['Anthropic', 'SpaceX', 'OpenAI', 'Kalshi'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: '#0A0A0B',
          padding: '60px 80px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Big tagline text */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 60 }}>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: -2 }}>
            Sign Up.
          </span>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1, letterSpacing: -2 }}>
            Trade $15.
          </span>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#10B981', lineHeight: 1.1, letterSpacing: -2 }}>
            Get $20.
          </span>
        </div>

        {/* Right: 2x2 logo grid */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            width: 340,
            gap: 24,
          }}
        >
          {logoUrls.map((url, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: 148,
                gap: 10,
              }}
            >
              <img
                src={url}
                width={96}
                height={96}
                style={{ borderRadius: 48, objectFit: 'cover' }}
              />
              <span style={{ fontSize: 22, fontWeight: 600, color: '#E5E7EB' }}>
                {companyNames[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
