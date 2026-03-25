import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title = searchParams.get('title') ?? 'Untitled Post';
  const category = searchParams.get('category') ?? 'General';
  const date = searchParams.get('date') ?? '';
  const readingTime = searchParams.get('readingTime') ?? '';

  const formattedDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).toUpperCase()
    : '';

  const metaLine = [formattedDate, readingTime ? `${readingTime} MIN READ` : '']
    .filter(Boolean)
    .join('  ·  ');

  const fontSize = title.length > 60 ? 38 : title.length > 40 ? 46 : 54;

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
        {/* Accent bar at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3A2E6F, #7B6FBF, #3A2E6F)',
          }}
        />

        {/* Main card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            backgroundColor: '#16171C',
            border: '1px solid #2A2B33',
            padding: '48px 56px',
          }}
        >
          {/* Top: Branding row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '8px',
                  color: '#7B6FBF',
                }}
              >
                OCULUS
              </div>
              <div
                style={{
                  width: '1px',
                  height: '20px',
                  backgroundColor: '#2A2B33',
                }}
              />
              <div
                style={{
                  fontSize: '14px',
                  color: '#585C65',
                  letterSpacing: '2px',
                }}
              >
                JLABS DIGITAL
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#7B6FBF',
                color: '#FFFFFF',
                padding: '6px 18px',
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
              }}
            >
              {category}
            </div>
          </div>

          {/* Center: Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              paddingTop: '32px',
              paddingBottom: '32px',
            }}
          >
            <div
              style={{
                fontSize: `${fontSize}px`,
                fontWeight: 700,
                color: '#E8E9ED',
                lineHeight: 1.15,
                maxHeight: '200px',
                overflow: 'hidden',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom: Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #2A2B33',
              paddingTop: '20px',
              fontSize: '14px',
            }}
          >
            <div style={{ color: '#9AA0A6', letterSpacing: '1px' }}>
              {metaLine}
            </div>
            <div style={{ color: '#585C65', fontSize: '12px', letterSpacing: '1px' }}>
              oculus.jlabsdigital.com
            </div>
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
