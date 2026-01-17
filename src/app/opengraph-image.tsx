import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Clear Sarkari Exam - Latest Government Job Notifications';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom, #ffffff, #f3f4f6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            background: '#BF1A1A',
            color: 'white',
            padding: '40px 80px',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: '20px' }}>
            Clear Sarkari Exam
          </div>
          <div style={{ fontSize: 40, opacity: 0.9 }}>
            Latest Government Job Notifications
          </div>
        </div>
        <div
          style={{
            marginTop: '40px',
            fontSize: 32,
            color: '#4b5563',
            display: 'flex',
            gap: '40px',
          }}
        >
          <span>✓ Job Notifications</span>
          <span>✓ Results</span>
          <span>✓ Admit Cards</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
