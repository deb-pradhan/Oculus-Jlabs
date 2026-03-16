import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title = searchParams.get('title') ?? 'Untitled Post';
  const category = searchParams.get('category') ?? 'General';
  const date = searchParams.get('date') ?? '';
  const readingTime = searchParams.get('readingTime') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0C0D10',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            backgroundColor: '#16171C',
            borderRadius: '0px',
            border: '1px solid #2A2B32',
            padding: '48px 56px',
          }}
        >
          {/* Top: Branding */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div
              style={{
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '6px',
                color: '#7B6FBF',
                fontFamily: 'monospace',
              }}
            >
              OCULUS
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#585C65',
                fontFamily: 'monospace',
              }}
            >
              by Jlabs Digital
            </div>
          </div>

          {/* Center: Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              paddingTop: '24px',
              paddingBottom: '24px',
            }}
          >
            <div
              style={{
                fontSize: title.length > 60 ? '36px' : title.length > 40 ? '44px' : '52px',
                fontWeight: 700,
                color: '#E8E9ED',
                lineHeight: 1.2,
                maxHeight: '180px',
                overflow: 'hidden',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom: Metadata row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontFamily: 'monospace',
              fontSize: '14px',
            }}
          >
            <div
              style={{
                backgroundColor: '#7B6FBF',
                color: '#FFFFFF',
                padding: '6px 16px',
                borderRadius: '0px',
                fontWeight: 600,
                fontSize: '13px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
            {date && (
              <div style={{ color: '#585C65' }}>
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            )}
            {readingTime && (
              <div style={{ color: '#585C65' }}>
                {readingTime} min read
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
