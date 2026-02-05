import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const imageUrl = searchParams.get('i') || '';
  const hasImage = imageUrl && imageUrl.length > 0;
  const logoUrl = new URL('/logo-boat.png', request.url).toString();

  // OG image is ONLY the visual - no embedded text
  // All text goes in og:title and iMessage renders it below
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
        {hasImage && (
          <img
            src={imageUrl}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
