import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { FIXED_DARK_SHARE_COLORS } from '../../../lib/shareTheme';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin;

  // Perps we trade — the default-watchlist crypto majors.
  const logoUrls = [
    `${baseUrl}/logos/tokens/btc.png`,
    `${baseUrl}/logos/tokens/eth.png`,
    `${baseUrl}/logos/tokens/sol.png`,
    `${baseUrl}/logos/tokens/hype.png`,
  ];

  const companyNames = ['BTC', 'ETH', 'SOL', 'HYPE'];

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
        {/* Left: referral offer, stated as promotional points rather than cash. */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 60 }}>
          <span style={{ fontSize: 72, fontWeight: 800, fontFamily: 'sans serif', color: '#FFFFFF', lineHeight: 1.1, letterSpacing: -2 }}>
            Invite friends.
          </span>
          <span style={{ fontSize: 72, fontWeight: 800, fontFamily: 'sans serif', color: '#FFFFFF', lineHeight: 1.1, letterSpacing: -2 }}>
            Earn up to
          </span>
          <span style={{ fontSize: 72, fontWeight: 800, fontFamily: 'sans serif', color: FIXED_DARK_SHARE_COLORS.brandAccent, lineHeight: 1.1, letterSpacing: -2 }}>
            $500 in points.
          </span>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: 28,
              gap: 6,
              maxWidth: 620,
              color: '#C9CDD3',
              fontSize: 22,
              lineHeight: 1.35,
            }}
          >
            <span>You and each qualifying friend can receive $50 in promotional, non-cash points.</span>
            <span>You earn 20% of the points they generate.</span>
            <span style={{ color: '#8E949D', fontSize: 18 }}>Terms and eligibility apply.</span>
          </div>
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
