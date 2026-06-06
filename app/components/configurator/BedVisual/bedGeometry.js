export function getBedGeometry(size = "double") {
  const scaleMap = {
    single: 0.72,
    "small-double": 0.82,
    double: 0.92,
    king: 1.0,
    "super-king": 1.08,
  };

  const s = scaleMap[size] || 0.92;

  return {
    cx: 400,
    scale: s,

    left: 400 - 240 * s,
    right: 400 + 240 * s,

    floorY: 460,
    baseY: 320,
    mattressY: 298,
    headY: 80,
  };
}