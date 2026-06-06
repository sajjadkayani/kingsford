export const COLOUR_HEX = {
  'Cream':         '#EDE8D5',
  'Ivory':         '#F9F6EE',
  'White':         '#F5F5F5',
  'Stone':         '#A89880',
  'Oyster':        '#D4C9B0',
  'Light Grey':    '#C5C5C5',
  'Slate Grey':    '#6D7E8A',
  'Charcoal':      '#3D4449',
  'Graphite':      '#4A4A4A',
  'Dark Grey':     '#2E2E2E',
  'Navy':          '#1B2A4A',
  'Midnight Blue': '#162038',
  'Steel Blue':    '#4A7FA5',
  'Powder Blue':   '#AABFCF',
  'Royal Blue':    '#2B4BA8',
  'Forest Green':  '#2D5A27',
  'Sage Green':    '#8A9E7A',
  'Emerald Green': '#1A7A4A',
  'Teal':          '#1A6B6B',
  'Hunter Green':  '#3A5C3A',
  'Blush Pink':    '#E8B4B8',
  'Dusty Pink':    '#C4907A',
  'Rose':          '#C4607A',
  'Burgundy':      '#6B1A2A',
  'Wine Red':      '#6B2535',
  'Camel':         '#B8905A',
  'Tan':           '#C8A87A',
  'Mink':          '#8A6B50',
  'Chocolate':     '#5A3020',
  'Black':         '#1A1A1A',
}

export const ALL_COLOURS = Object.keys(COLOUR_HEX)

export function getColourHex(name) {
  return COLOUR_HEX[name] || '#888888'
}
