// app/components/configurator/BedVisual/AddonsLayer.jsx

import { getBedGeometry } from './getBedGeometry'

function UsbPorts({ right, pillowY }) {
  const x = right - 30
  const y = pillowY - 18

  return (
    <g className="addon-usb">
      {/* Port housing */}
      <rect
        x={x}
        y={y}
        width="26"
        height="10"
        rx="2"
        fill="rgba(30,28,24,0.9)"
        stroke="rgba(201,169,110,0.2)"
        strokeWidth="0.5"
      />
      {/* Left port slot */}
      <rect
        x={x + 3}
        y={y + 2}
        width="8"
        height="6"
        rx="1"
        fill="rgba(0,0,0,0.6)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.5"
      />
      {/* Right port slot */}
      <rect
        x={x + 15}
        y={y + 2}
        width="8"
        height="6"
        rx="1"
        fill="rgba(0,0,0,0.6)"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.5"
      />
      {/* Tiny indicator light */}
      <circle
        cx={x + 23}
        cy={y + 2}
        r="1.2"
        fill="rgba(100,220,100,0.7)"
      />
    </g>
  )
}

function DiamondButtoning({ left, right, headY, colour }) {
  // Overlay a diamond grid on the headboard area
  const cols      = 5
  const rows       = 3
  const spacingX  = (right - left - 60) / (cols - 1)
  const spacingY  = 60
  const startY    = headY + 30

  const buttons = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const offsetX = r % 2 === 1 ? spacingX / 2 : 0
      buttons.push({
        x: left + 30 + c * spacingX + offsetX,
        y: startY + r * spacingY,
      })
    }
  }

  return (
    <g className="addon-buttoning" opacity="0.75">
      {buttons.map((btn, i) => (
        <g key={i}>
          {/* Stitch lines to next row */}
          {i < buttons.length - cols && buttons[i + cols] && (
            <line
              x1={btn.x} y1={btn.y}
              x2={buttons[i + cols].x} y2={buttons[i + cols].y}
              stroke="rgba(0,0,0,0.14)"
              strokeWidth="0.8"
            />
          )}
          {/* Diagonal stitch to next in row */}
          {i % cols < cols - 1 && (
            <line
              x1={btn.x} y1={btn.y}
              x2={btn.x + spacingX} y2={btn.y}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="0.6"
            />
          )}
          {/* Button */}
          <circle cx={btn.x} cy={btn.y} r="5"   fill="rgba(0,0,0,0.22)" />
          <circle cx={btn.x} cy={btn.y} r="3"   fill="rgba(0,0,0,0.38)" />
          <circle
            cx={btn.x - 1}
            cy={btn.y - 1}
            r="1.5"
            fill="rgba(255,255,255,0.13)"
          />
        </g>
      ))}
    </g>
  )
}

function LedStrip({ left, right, y }) {
  return (
    <g className="addon-led">
      {/* Glow blur layer */}
      <line
        x1={left + 12} y1={y}
        x2={right - 12} y2={y}
        stroke="rgba(201,169,110,0.18)"
        strokeWidth="10"
        strokeLinecap="round"
        style={{ filter: 'blur(4px)' }}
      />
      {/* Sharp line */}
      <line
        x1={left + 12} y1={y}
        x2={right - 12} y2={y}
        stroke="rgba(201,169,110,0.55)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  )
}

export default function AddonsLayer({ size, style, addons, colour }) {
  if (!addons || addons.length === 0) return null

  const geo = getBedGeometry(size)
  const { left, right, headTall, headboardBottom, pillowY } = geo

  return (
    <g className="addons-layer">

      {addons.includes('usb-ports') && (
        <UsbPorts
          right={right}
          pillowY={pillowY}
        />
      )}

      {addons.includes('diamond-buttoning') && (
        <DiamondButtoning
          left={left}
          right={right}
          headY={headTall}
          colour={colour}
        />
      )}

      {addons.includes('led-strip') && (
        <LedStrip
          left={left}
          right={right}
          y={headboardBottom - 2}
        />
      )}

    </g>
  )
}