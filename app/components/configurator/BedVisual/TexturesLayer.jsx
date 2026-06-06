// app/components/configurator/BedVisual/TexturesLayer.jsx

export default function TexturesLayer() {
  return (
    <defs>

      {/* ── Velvet — fine diagonal shimmer ── */}
      <pattern
        id="texture-velvet"
        patternUnits="userSpaceOnUse"
        width="4"
        height="4"
      >
        <rect width="4" height="4" fill="none" />
        <line
          x1="0" y1="4" x2="4" y2="0"
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="0.8"
        />
        <line
          x1="-1" y1="1" x2="1" y2="-1"
          stroke="rgba(255,255,255,0.02)"
          strokeWidth="0.5"
        />
      </pattern>

      {/* ── Linen — natural crosshatch weave ── */}
      <pattern
        id="texture-linen"
        patternUnits="userSpaceOnUse"
        width="6"
        height="6"
      >
        <rect width="6" height="6" fill="none" />
        <line x1="0" y1="0" x2="6" y2="0" stroke="rgba(0,0,0,0.07)" strokeWidth="0.8" />
        <line x1="0" y1="2" x2="6" y2="2" stroke="rgba(0,0,0,0.04)" strokeWidth="0.4" />
        <line x1="0" y1="4" x2="6" y2="4" stroke="rgba(0,0,0,0.04)" strokeWidth="0.4" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.07)" strokeWidth="0.8" />
        <line x1="2" y1="0" x2="2" y2="6" stroke="rgba(0,0,0,0.04)" strokeWidth="0.4" />
        <line x1="4" y1="0" x2="4" y2="6" stroke="rgba(0,0,0,0.04)" strokeWidth="0.4" />
      </pattern>

      {/* ── Chenille — soft raised dot texture ── */}
      <pattern
        id="texture-chenille"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
      >
        <rect width="8" height="8" fill="none" />
        <circle cx="4" cy="4" r="1.2" fill="rgba(255,255,255,0.055)" />
        <circle cx="0" cy="0" r="0.9" fill="rgba(255,255,255,0.03)" />
        <circle cx="8" cy="0" r="0.9" fill="rgba(255,255,255,0.03)" />
        <circle cx="0" cy="8" r="0.9" fill="rgba(255,255,255,0.03)" />
        <circle cx="8" cy="8" r="0.9" fill="rgba(255,255,255,0.03)" />
      </pattern>

      {/* ── Faux Leather — tight grid stitch ── */}
      <pattern
        id="texture-faux-leather"
        patternUnits="userSpaceOnUse"
        width="12"
        height="12"
      >
        <rect width="12" height="12" fill="none" />
        <line x1="0" y1="0"  x2="12" y2="0"  stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="0" y1="6"  x2="12" y2="6"  stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="0" y1="0"  x2="0"  y2="12" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="6" y1="0"  x2="6"  y2="12" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        {/* Corner stitch dots */}
        <circle cx="0"  cy="0"  r="0.8" fill="rgba(255,255,255,0.06)" />
        <circle cx="12" cy="0"  r="0.8" fill="rgba(255,255,255,0.06)" />
        <circle cx="0"  cy="12" r="0.8" fill="rgba(255,255,255,0.06)" />
        <circle cx="12" cy="12" r="0.8" fill="rgba(255,255,255,0.06)" />
      </pattern>

      {/* ── Shared gradient — base platform depth ── */}
      <linearGradient id="baseGradient" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0%"   stopColor="#3a2f22" />
        <stop offset="45%"  stopColor="#2a2218" />
        <stop offset="100%" stopColor="#120f0b" />
      </linearGradient>

    </defs>
  )
}