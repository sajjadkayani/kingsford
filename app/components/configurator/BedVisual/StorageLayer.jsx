// app/components/configurator/BedVisual/StorageLayer.jsx

import { getBedGeometry } from './getBedGeometry'

const GOLD_LINE    = 'rgba(201,169,110,0.22)'
const GOLD_HANDLE  = 'rgba(201,169,110,0.35)'
const GOLD_TEXT    = 'rgba(201,169,110,0.4)'
const GOLD_DIVIDER = 'rgba(201,169,110,0.12)'

function OttomanLift({ left, right, midY }) {
  return (
    <g className="storage-ottoman">
      {/* Lift line */}
      <line
        x1={left + 10} y1={midY}
        x2={right - 10} y2={midY}
        stroke={GOLD_LINE}
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      {/* Small hinge indicator centre */}
      <rect
        x={395} y={midY - 5}
        width="10" height="10"
        rx="2"
        fill="none"
        stroke={GOLD_HANDLE}
        strokeWidth="1"
      />
      <text
        x="400"
        y={midY + 22}
        textAnchor="middle"
        fontSize="8"
        fill={GOLD_TEXT}
        fontFamily="system-ui"
        letterSpacing="0.14em"
      >
        LIFT-UP STORAGE
      </text>
    </g>
  )
}

function TwoDrawers({ left, right, midY }) {
  const handleY    = midY - 4
  const handleW    = 36
  const leftHandleX  = left  + (right - left) * 0.18
  const rightHandleX = right - (right - left) * 0.18 - handleW

  return (
    <g className="storage-2drawer">
      {/* Horizontal split line */}
      <line
        x1={left + 10} y1={midY}
        x2={right - 10} y2={midY}
        stroke={GOLD_LINE}
        strokeWidth="1"
      />
      {/* Vertical centre divider */}
      <line
        x1={400} y1={midY - 40}
        x2={400} y2={midY + 40}
        stroke={GOLD_DIVIDER}
        strokeWidth="1"
      />
      {/* Left handle */}
      <rect
        x={leftHandleX}
        y={handleY}
        width={handleW}
        height="8"
        rx="4"
        fill={GOLD_HANDLE}
      />
      {/* Right handle */}
      <rect
        x={rightHandleX}
        y={handleY}
        width={handleW}
        height="8"
        rx="4"
        fill={GOLD_HANDLE}
      />
      <text
        x="400"
        y={midY + 22}
        textAnchor="middle"
        fontSize="8"
        fill={GOLD_TEXT}
        fontFamily="system-ui"
        letterSpacing="0.14em"
      >
        2 DRAWERS
      </text>
    </g>
  )
}

function FourDrawers({ left, right, midY }) {
  const handleW   = 28
  const rowTop    = midY - 22
  const rowBot    = midY + 10
  const q         = (right - left) / 4

  const handles = [
    { x: left + q * 0.5 - handleW / 2, y: rowTop },
    { x: left + q * 1.5 - handleW / 2, y: rowTop },
    { x: left + q * 2.5 - handleW / 2, y: rowBot },
    { x: left + q * 3.5 - handleW / 2, y: rowBot },
  ]

  return (
    <g className="storage-4drawer">
      {/* Horizontal lines */}
      <line
        x1={left + 10} y1={midY - 8}
        x2={right - 10} y2={midY - 8}
        stroke={GOLD_LINE}
        strokeWidth="1"
      />
      <line
        x1={left + 10} y1={midY + 24}
        x2={right - 10} y2={midY + 24}
        stroke={GOLD_LINE}
        strokeWidth="1"
      />
      {/* Vertical centre divider */}
      <line
        x1={400} y1={midY - 40}
        x2={400} y2={midY + 40}
        stroke={GOLD_DIVIDER}
        strokeWidth="1"
      />
      {/* 4 handles */}
      {handles.map((h, i) => (
        <rect
          key={i}
          x={h.x}
          y={h.y}
          width={handleW}
          height="6"
          rx="3"
          fill={GOLD_HANDLE}
        />
      ))}
      <text
        x="400"
        y={midY + 42}
        textAnchor="middle"
        fontSize="8"
        fill={GOLD_TEXT}
        fontFamily="system-ui"
        letterSpacing="0.14em"
      >
        4 DRAWERS
      </text>
    </g>
  )
}

export default function StorageLayer({ size, style, storage }) {
  // Only show for divan or ottoman
  if (style !== 'divan' && style !== 'ottoman') return null
  if (!storage || storage === 'none') return null

  const geo  = getBedGeometry(size)
  const { left, right, baseTop, baseBottom } = geo
  const midY = baseTop + (baseBottom - baseTop) / 2

  if (storage === 'ottoman-lift' || style === 'ottoman') {
    return <OttomanLift left={left} right={right} midY={midY} />
  }

  if (storage === '2-drawer') {
    return <TwoDrawers left={left} right={right} midY={midY} />
  }

  if (storage === '4-drawer') {
    return <FourDrawers left={left} right={right} midY={midY} />
  }

  return null
}