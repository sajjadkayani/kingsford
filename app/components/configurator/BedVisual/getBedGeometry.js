// app/components/configurator/BedVisual/getBedGeometry.js

export const VIEWBOX = { width: 800, height: 500 }
export const CENTER_X = 400

export const SIZE_SCALE = {
  'single':       0.72,
  'small-double': 0.82,
  'double':       0.92,
  'king':         1.00,
  'super-king':   1.08,
}

export function getBedGeometry(size = 'king') {
  const scale = SIZE_SCALE[size] ?? 1.0

  const left  = CENTER_X - 240 * scale
  const right = CENTER_X + 240 * scale

  // ── Vertical layout (top to bottom) ──────────────────────────
  //
  //  Y=60   ← headboard top (tall styles)
  //  Y=140  ← headboard top (mid styles)
  //  Y=210  ← headboard top (low styles)
  //  Y=280  ← headboard bottom / mattress top
  //  Y=295  ← base platform top
  //  Y=390  ← base platform bottom / leg top
  //  Y=430  ← leg bottom / floor
  //  Y=460  ← floor shadow
  //
  const headboardBottom = 280
  const baseTop         = 295
  const baseBottom      = 390
  const legY            = 390
  const legHeight       = 32
  const floorY          = 440

  return {
    scale,
    left,
    right,
    width: right - left,

    // Floor
    floorY,

    // Base
    baseTop,
    baseBottom,

    // Mattress sits on top of base
    mattressTop:    baseTop - 18,
    mattressHeight: 20,

    // Pillows sit above mattress
    pillowY:        baseTop - 52,
    pillowHeight:   32,

    // Headboard anchors
    headboardBottom,
    headTall:   60,
    headMid:    140,
    headLow:    210,

    // Legs
    legY,
    legHeight,
  }
}