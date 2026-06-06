// app/components/configurator/BedVisual/BaseLayer.jsx

import { getBedGeometry } from './getBedGeometry'

export default function BaseLayer({ size }) {
  const geo = getBedGeometry(size)

  const {
    left,
    right,
    width,
    baseTop,
    baseBottom,
    floorY,
    legY,
  } = geo

  return (
    <g className="base-layer">

      {/* ── Floor shadow ── */}
      <ellipse
        cx="400"
        cy={floorY - 4}
        rx={width * 0.52}
        ry="14"
        fill="rgba(0,0,0,0.32)"
        filter="blur(8px)"
        style={{ filter: 'blur(8px)' }}
      />

      {/* ── Bed platform ── */}
      <rect
        x={left}
        y={baseTop}
        width={width}
        height={baseBottom - baseTop}
        rx="6"
        fill="url(#baseGradient)"
      />

      {/* ── Top edge highlight ── */}
      <rect
        x={left + 2}
        y={baseTop}
        width={width - 4}
        height="3"
        rx="2"
        fill="rgba(201,169,110,0.14)"
      />

      {/* ── Side depth lines ── */}
      <line
        x1={left}  y1={baseTop}
        x2={left}  y2={baseBottom}
        stroke="rgba(201,169,110,0.07)"
        strokeWidth="1"
      />
      <line
        x1={right} y1={baseTop}
        x2={right} y2={baseBottom}
        stroke="rgba(201,169,110,0.07)"
        strokeWidth="1"
      />

      {/* ── Mattress platform lip ── */}
      <rect
        x={left + 8}
        y={baseTop - 22}
        width={width - 16}
        height="28"
        rx="4"
        fill="#252118"
      />
      <rect
        x={left + 8}
        y={baseTop - 22}
        width={width - 16}
        height="4"
        rx="2"
        fill="rgba(255,255,255,0.035)"
      />

    </g>
  )
}