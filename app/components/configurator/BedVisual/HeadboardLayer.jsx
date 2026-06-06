// app/components/configurator/BedVisual/HeadboardLayer.jsx

import { useState, useEffect } from 'react'
import { getBedGeometry } from './getBedGeometry'

// ─── Shared Y anchors from geometry ─────────────────────────────────────────

function getY(geo) {
  return {
    tall:   geo.headTall,
    mid:    geo.headMid,
    low:    geo.headLow,
    bottom: geo.headboardBottom,
  }
}

// ─── Headboard shapes ────────────────────────────────────────────────────────

function ClassicPanel({ left, right, colour, fabric, y, height = 230 }) {
  return (
    <g>
      <rect
        x={left} y={y}
        width={right - left} height={height}
        rx="8"
        fill={colour}
        opacity="0.95"
      />
      <rect
        x={left} y={y}
        width={right - left} height={height}
        rx="8"
        fill={`url(#texture-${fabric})`}
      />
      <rect
        x={left + 2} y={y}
        width={right - left - 4} height="4"
        rx="2"
        fill="rgba(255,255,255,0.12)"
      />
      <rect
        x={left} y={y}
        width="6" height={height}
        rx="3"
        fill="rgba(0,0,0,0.18)"
      />
    </g>
  )
}

function WingedPanel({ left, right, colour, fabric, y, wingOut = 40, wingTopY = 140, wingBotY = 290 }) {
  return (
    <g>
      {/* Left wing */}
      <path
        d={`M ${left - wingOut} ${wingTopY} L ${left} ${y} L ${left} ${y + 210} L ${left - wingOut} ${wingBotY} Z`}
        fill={colour} opacity="0.85"
      />
      <path
        d={`M ${left - wingOut} ${wingTopY} L ${left} ${y} L ${left} ${y + 210} L ${left - wingOut} ${wingBotY} Z`}
        fill={`url(#texture-${fabric})`}
      />
      {/* Right wing */}
      <path
        d={`M ${right + wingOut} ${wingTopY} L ${right} ${y} L ${right} ${y + 210} L ${right + wingOut} ${wingBotY} Z`}
        fill={colour} opacity="0.85"
      />
      <path
        d={`M ${right + wingOut} ${wingTopY} L ${right} ${y} L ${right} ${y + 210} L ${right + wingOut} ${wingBotY} Z`}
        fill={`url(#texture-${fabric})`}
      />
      {/* Centre panel */}
      <rect
        x={left} y={y}
        width={right - left} height={230}
        rx="8"
        fill={colour} opacity="0.95"
      />
      <rect
        x={left} y={y}
        width={right - left} height={230}
        rx="8"
        fill={`url(#texture-${fabric})`}
      />
      <rect
        x={left + 2} y={y}
        width={right - left - 4} height="4"
        rx="2"
        fill="rgba(255,255,255,0.12)"
      />
    </g>
  )
}

function ThreePanel({ left, right, colour, fabric, y }) {
  const panelW = (right - left - 32) / 3
  return (
    <g>
      <rect
        x={left} y={y}
        width={right - left} height={210}
        rx="6"
        fill={colour} opacity="0.95"
      />
      <rect
        x={left} y={y}
        width={right - left} height={210}
        rx="6"
        fill={`url(#texture-${fabric})`}
      />
      {/* Divider lines */}
      <line
        x1={left + panelW + 8}     y1={y + 10}
        x2={left + panelW + 8}     y2={y + 190}
        stroke="rgba(0,0,0,0.2)" strokeWidth="2"
      />
      <line
        x1={left + panelW * 2 + 16} y1={y + 10}
        x2={left + panelW * 2 + 16} y2={y + 190}
        stroke="rgba(0,0,0,0.2)" strokeWidth="2"
      />
      <rect
        x={left + 2} y={y}
        width={right - left - 4} height="4"
        rx="2"
        fill="rgba(255,255,255,0.12)"
      />
    </g>
  )
}

function SleighCurve({ left, right, colour, fabric }) {
  const mid = (left + right) / 2
  return (
    <g>
      <path
        d={`M ${left} 310
            C ${left} 310, ${left - 20} 180, ${left + 40} 100
            C ${mid} 50, ${mid} 50, ${right - 40} 100
            C ${right + 20} 180, ${right} 310, ${right} 310 Z`}
        fill={colour} opacity="0.95"
      />
      <path
        d={`M ${left} 310
            C ${left} 310, ${left - 20} 180, ${left + 40} 100
            C ${mid} 50, ${mid} 50, ${right - 40} 100
            C ${right + 20} 180, ${right} 310, ${right} 310 Z`}
        fill={`url(#texture-${fabric})`}
      />
      {/* Highlight on curve */}
      <path
        d={`M ${left + 20} 290 C ${left + 10} 200, ${left + 50} 120, ${mid} 70`}
        fill="none"
        stroke="rgba(255,255,255,0.09)"
        strokeWidth="3"
      />
    </g>
  )
}

function ChesterfieldButtons({ left, right, colour, fabric, y }) {
  const cols = 5
  const rows = 4
  const spacingX = (right - left - 40) / (cols - 1)
  const spacingY = 180 / (rows - 1)

  const buttons = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = r % 2 === 1 ? spacingX / 2 : 0
      buttons.push({
        x: left + 20 + c * spacingX + offsetX,
        y: y + 20 + r * spacingY,
      })
    }
  }

  return (
    <g>
      <rect
        x={left} y={y}
        width={right - left} height={230}
        rx="8"
        fill={colour} opacity="0.95"
      />
      <rect
        x={left} y={y}
        width={right - left} height={230}
        rx="8"
        fill={`url(#texture-${fabric})`}
      />
      {buttons.map((btn, i) => (
        <g key={i}>
          <circle cx={btn.x} cy={btn.y} r="5"   fill="rgba(0,0,0,0.25)" />
          <circle cx={btn.x} cy={btn.y} r="3"   fill="rgba(0,0,0,0.4)" />
          <circle cx={btn.x - 1} cy={btn.y - 1} r="1.5" fill="rgba(255,255,255,0.14)" />
          {i < buttons.length - cols && (
            <line
              x1={btn.x} y1={btn.y}
              x2={buttons[i + cols]?.x} y2={buttons[i + cols]?.y}
              stroke="rgba(0,0,0,0.1)" strokeWidth="0.8"
            />
          )}
        </g>
      ))}
      <rect
        x={left + 2} y={y}
        width={right - left - 4} height="4"
        rx="2"
        fill="rgba(255,255,255,0.12)"
      />
    </g>
  )
}

function LowWide({ left, right, colour, fabric, y }) {
  return (
    <g>
      <rect
        x={left - 10} y={y}
        width={right - left + 20} height={90}
        rx="6"
        fill={colour} opacity="0.95"
      />
      <rect
        x={left - 10} y={y}
        width={right - left + 20} height={90}
        rx="6"
        fill={`url(#texture-${fabric})`}
      />
      <rect
        x={left - 8} y={y}
        width={right - left + 16} height="3"
        rx="1.5"
        fill="rgba(255,255,255,0.11)"
      />
    </g>
  )
}

// ─── Map style + headboard key → component + props resolver ─────────────────

function resolveHeadboard(style, headboard, left, right, Y, colour, fabric) {
  const key = `${style}-${headboard}`

  const props = { left, right, colour, fabric }

  switch (key) {

    // Ottoman
    case 'ottoman-classic':
      return <ClassicPanel {...props} y={Y.tall} height={230} />
    case 'ottoman-winged':
      return <WingedPanel  {...props} y={Y.tall} wingOut={40} wingTopY={Y.tall + 70} wingBotY={Y.bottom - 10} />
    case 'ottoman-low':
      return <LowWide      {...props} y={Y.low} />

    // Wingback
    case 'wingback-classic-wing':
      return <WingedPanel  {...props} y={Y.tall - 10} wingOut={55} wingTopY={Y.tall + 30} wingBotY={Y.bottom - 40} />
    case 'wingback-grand-wing':
      return <WingedPanel  {...props} y={Y.tall - 38} wingOut={70} wingTopY={Y.tall - 10} wingBotY={Y.bottom - 50} />
    case 'wingback-low-wing':
      return <LowWide      {...props} y={Y.low} />

    // Panel
    case 'panel-classic':
      return <ThreePanel   {...props} y={Y.mid} />
    case 'panel-tall':
      return <ClassicPanel {...props} y={Y.tall} height={230} />
    case 'panel-low':
      return <LowWide      {...props} y={Y.low} />

    // Sleigh
    case 'sleigh-classic-curve':
    case 'sleigh-scroll':
      return <SleighCurve  {...props} />
    case 'sleigh-low-curve':
      return <LowWide      {...props} y={Y.low} />

    // Chesterfield
    case 'chesterfield-classic-button':
    case 'chesterfield-grand-button':
      return <ChesterfieldButtons {...props} y={Y.tall} />
    case 'chesterfield-low-button':
      return <LowWide      {...props} y={Y.low} />

    // Divan
    case 'divan-classic':
      return <ClassicPanel {...props} y={Y.mid} height={200} />
    case 'divan-low':
      return <LowWide      {...props} y={Y.low} />

    // Low profile
    case 'low-profile-classic-low':
    case 'low-profile-platform':
      return <LowWide      {...props} y={Y.low} />

    default:
      return <ClassicPanel {...props} y={Y.tall} height={230} />
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function HeadboardLayer({ size, style, headboard, colour, fabric }) {
  const geo  = getBedGeometry(size)
  const Y    = getY(geo)
  const { left, right } = geo

  const [current, setCurrent] = useState({ style, headboard, colour, fabric })
  const [next,    setNext]    = useState(null)
  const [fading,  setFading]  = useState(false)

  useEffect(() => {
    const changed =
      style     !== current.style    ||
      headboard !== current.headboard ||
      colour    !== current.colour   ||
      fabric    !== current.fabric

    if (!changed) return

    setNext({ style, headboard, colour, fabric })
    setFading(true)

    const t = setTimeout(() => {
      setCurrent({ style, headboard, colour, fabric })
      setNext(null)
      setFading(false)
    }, 350)

    return () => clearTimeout(t)
  }, [style, headboard, colour, fabric])

  const transitionStyle = (visible) => ({
    opacity:    visible ? 1 : 0,
    transition: 'opacity 350ms ease',
  })

  return (
    <g className="headboard-layer">

      {/* Current — fades out when changing */}
      <g style={transitionStyle(!fading)}>
        {resolveHeadboard(
          current.style, current.headboard,
          left, right, Y,
          current.colour, current.fabric
        )}
      </g>

      {/* Next — fades in */}
      {next && (
        <g style={transitionStyle(fading)}>
          {resolveHeadboard(
            next.style, next.headboard,
            left, right, Y,
            next.colour, next.fabric
          )}
        </g>
      )}

    </g>
  )
}