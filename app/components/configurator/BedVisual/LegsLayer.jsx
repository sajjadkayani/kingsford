// app/components/configurator/BedVisual/LegsLayer.jsx

import { getBedGeometry } from './getBedGeometry'

const LEG_STYLES = {
  chrome: {
    base:      '#B8B8B8',
    highlight: 'rgba(220,220,220,0.5)',
    shadow:    'rgba(0,0,0,0.3)',
    shine:     'rgba(255,255,255,0.35)',
  },
  gold: {
    base:      '#C9A96E',
    highlight: 'rgba(210,180,110,0.5)',
    shadow:    'rgba(0,0,0,0.25)',
    shine:     'rgba(255,220,140,0.3)',
  },
  wooden: {
    base:      '#7A5C1E',
    highlight: 'rgba(160,120,50,0.4)',
    shadow:    'rgba(0,0,0,0.3)',
    shine:     'rgba(200,160,80,0.2)',
  },
}

function SingleLeg({ x, y, height, legStyle }) {
  const s = LEG_STYLES[legStyle] || LEG_STYLES.chrome
  const width = 14

  return (
    <g>
      {/* Main leg body */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="3"
        fill={s.base}
      />
      {/* Left shine strip */}
      <rect
        x={x + 2}
        y={y}
        width="4"
        height={height}
        rx="2"
        fill={s.shine}
      />
      {/* Bottom shadow */}
      <rect
        x={x}
        y={y + height - 5}
        width={width}
        height="5"
        rx="2"
        fill={s.shadow}
      />
      {/* Top cap highlight */}
      <rect
        x={x}
        y={y}
        width={width}
        height="3"
        rx="2"
        fill={s.highlight}
      />
    </g>
  )
}

export default function LegsLayer({ size, style, legs }) {
  // Divan has no legs
  if (!legs || legs === 'none' || style === 'divan') return null

  const geo = getBedGeometry(size)
  const { left, right, legY, legHeight } = geo

  return (
    <g className="legs-layer">
      {/* Front left leg */}
      <SingleLeg
        x={left + 10}
        y={legY}
        height={legHeight}
        legStyle={legs}
      />
      {/* Front right leg */}
      <SingleLeg
        x={right - 24}
        y={legY}
        height={legHeight}
        legStyle={legs}
      />
    </g>
  )
}