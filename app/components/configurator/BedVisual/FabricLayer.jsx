// app/components/configurator/BedVisual/FabricLayer.jsx

import { getBedGeometry } from './getBedGeometry'

export default function FabricLayer({ size, colour, fabric }) {
  const geo = getBedGeometry(size)

  const {
    left,
    right,
    width,
    mattressTop,
    mattressHeight,
    pillowY,
    pillowHeight,
  } = geo

  const hex         = colour || '#3A3A3A'
  const fabricKey   = fabric || 'velvet'
  const pillowWidth = width * 0.42
  const leftPillowX = left + 20
  const rightPillowX = right - 20 - pillowWidth

  return (
    <g className="fabric-layer">

      {/* ── Mattress surface ── */}
      <rect
        x={left}
        y={mattressTop}
        width={width}
        height={mattressHeight}
        rx="3"
        fill={hex}
        opacity="0.92"
      />
      <rect
        x={left}
        y={mattressTop}
        width={width}
        height={mattressHeight}
        rx="3"
        fill={`url(#texture-${fabricKey})`}
      />
      {/* Mattress top highlight */}
      <rect
        x={left + 2}
        y={mattressTop}
        width={width - 4}
        height="3"
        rx="1.5"
        fill="rgba(255,255,255,0.07)"
      />

      {/* ── Left pillow ── */}
      <rect
        x={leftPillowX}
        y={pillowY}
        width={pillowWidth}
        height={pillowHeight}
        rx="10"
        fill={hex}
        opacity="0.88"
      />
      <rect
        x={leftPillowX}
        y={pillowY}
        width={pillowWidth}
        height={pillowHeight}
        rx="10"
        fill={`url(#texture-${fabricKey})`}
      />
      {/* Left pillow highlight */}
      <rect
        x={leftPillowX + 4}
        y={pillowY + 4}
        width={pillowWidth - 8}
        height="6"
        rx="3"
        fill="rgba(255,255,255,0.055)"
      />
      {/* Left pillow inner border */}
      <rect
        x={leftPillowX + 5}
        y={pillowY + 5}
        width={pillowWidth - 10}
        height={pillowHeight - 10}
        rx="7"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />

      {/* ── Right pillow ── */}
      <rect
        x={rightPillowX}
        y={pillowY}
        width={pillowWidth}
        height={pillowHeight}
        rx="10"
        fill={hex}
        opacity="0.88"
      />
      <rect
        x={rightPillowX}
        y={pillowY}
        width={pillowWidth}
        height={pillowHeight}
        rx="10"
        fill={`url(#texture-${fabricKey})`}
      />
      {/* Right pillow highlight */}
      <rect
        x={rightPillowX + 4}
        y={pillowY + 4}
        width={pillowWidth - 8}
        height="6"
        rx="3"
        fill="rgba(255,255,255,0.055)"
      />
      {/* Right pillow inner border */}
      <rect
        x={rightPillowX + 5}
        y={pillowY + 5}
        width={pillowWidth - 10}
        height={pillowHeight - 10}
        rx="7"
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="1"
      />

    </g>
  )
}