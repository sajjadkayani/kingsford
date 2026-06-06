// app/components/configurator/BedVisual/DimensionsLayer.jsx

import { getBedGeometry } from './getBedGeometry'

const SIZE_LABELS = {
  'single':       '90 × 190 cm',
  'small-double': '120 × 190 cm',
  'double':       '135 × 190 cm',
  'king':         '150 × 200 cm',
  'super-king':   '180 × 200 cm',
}

export default function DimensionsLayer({ size }) {
  if (!size) return null

  const geo   = getBedGeometry(size)
  const label = SIZE_LABELS[size] || ''
  const lineY = 470
  const textY = 486
  const tickH = 6

  const { left, right } = geo

  // Line spans a bit wider than the bed for visual breathing room
  const lineLeft  = left  - 10
  const lineRight = right + 10

  return (
    <g className="dimensions-layer">

      {/* ── Left tick ── */}
      <line
        x1={lineLeft} y1={lineY - tickH / 2}
        x2={lineLeft} y2={lineY + tickH / 2}
        stroke="rgba(201,169,110,0.25)"
        strokeWidth="1"
      />

      {/* ── Dimension line ── */}
      <line
        x1={lineLeft}  y1={lineY}
        x2={lineRight} y2={lineY}
        stroke="rgba(201,169,110,0.12)"
        strokeWidth="1"
      />

      {/* ── Right tick ── */}
      <line
        x1={lineRight} y1={lineY - tickH / 2}
        x2={lineRight} y2={lineY + tickH / 2}
        stroke="rgba(201,169,110,0.25)"
        strokeWidth="1"
      />

      {/* ── Label ── */}
      <text
        x="400"
        y={textY}
        textAnchor="middle"
        fontSize="10"
        fill="rgba(201,169,110,0.45)"
        fontFamily="system-ui"
        letterSpacing="0.16em"
      >
        {label}
      </text>

    </g>
  )
}