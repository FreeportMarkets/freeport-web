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
          flexDirection: 'column',
          backgroundColor: '#0A0A0B',
          padding: '48px 60px',
          justifyContent: 'space-between',
        }}
      >
        {/* Top: Freeport branding */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={`${baseUrl}/logo-boat.png`}
            width={44}
            height={44}
            style={{ objectFit: 'contain', marginRight: 14 }}
          />
          <span style={{ fontSize: 28, fontWeight: 700, color: '#9CA3AF', letterSpacing: -0.5 }}>
            Freeport
          </span>
        </div>

        {/* Middle: CTA text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: -1 }}>
            Earn up to $1,000
          </span>
          <span style={{ fontSize: 56, fontWeight: 800, color: '#10B981', lineHeight: 1.15, letterSpacing: -1 }}>
            in Pre-IPO Equity
          </span>
          <span style={{ fontSize: 26, color: '#9CA3AF', marginTop: 8, fontWeight: 500 }}>
            Sign up, trade for 2 days, and you both get rewarded
          </span>
        </div>

        {/* Bottom: 4 company logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {logoUrls.map((url, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img
                src={url}
                width={52}
                height={52}
                style={{ borderRadius: 26, objectFit: 'cover' }}
              />
              <span style={{ fontSize: 20, fontWeight: 600, color: '#E5E7EB' }}>
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
