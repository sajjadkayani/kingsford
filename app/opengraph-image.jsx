import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Kingsford Sleep — Handcrafted British Beds'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f0e0c',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            background: '#c9a96e',
            color: '#0f0e0c',
            fontWeight: 800,
            fontSize: '52px',
            width: '110px',
            height: '110px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '36px',
            letterSpacing: '-1px',
          }}
        >
          KS
        </div>

        {/* Brand name */}
        <div
          style={{
            color: '#f5f0e8',
            fontSize: '64px',
            fontWeight: 700,
            marginBottom: '18px',
            letterSpacing: '-1px',
          }}
        >
          Kingsford Sleep
        </div>

        {/* Tagline */}
        <div
          style={{
            color: '#c9a96e',
            fontSize: '26px',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            marginBottom: '48px',
          }}
        >
          Handcrafted Beds · Made in the UK
        </div>

        {/* Divider */}
        <div
          style={{
            width: '80px',
            height: '2px',
            background: '#2a2820',
          }}
        />
      </div>
    ),
    size
  )
}
