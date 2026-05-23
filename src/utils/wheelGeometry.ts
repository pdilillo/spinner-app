const WHEEL_COLORS = [
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
  '#3b82f6',
]

export function getSegmentColor(index: number): string {
  return WHEEL_COLORS[index % WHEEL_COLORS.length]
}

export function getSegmentAngle(count: number): number {
  return 360 / count
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

export function describeSegmentPath(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, radius, startAngle)
  const end = polarToCartesian(cx, cy, radius, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

export function getLabelPosition(
  cx: number,
  cy: number,
  radius: number,
  midAngle: number,
): { x: number; y: number; rotation: number } {
  const labelRadius = radius * 0.62
  const pos = polarToCartesian(cx, cy, labelRadius, midAngle)
  return {
    x: pos.x,
    y: pos.y,
    rotation: midAngle,
  }
}

export function truncateLabel(label: string, maxLength = 14): string {
  if (label.length <= maxLength) return label
  return `${label.slice(0, maxLength - 1)}…`
}

export function computeTargetRotation(
  winnerIndex: number,
  itemCount: number,
  currentRotation: number,
  fullSpins = 5,
): number {
  const segmentAngle = getSegmentAngle(itemCount)
  const winnerCenter = winnerIndex * segmentAngle + segmentAngle / 2
  const minRotation = currentRotation + fullSpins * 360
  const baseTarget = minRotation + (360 - winnerCenter)
  const currentMod = currentRotation % 360
  const targetMod = baseTarget % 360
  const adjustment = targetMod <= currentMod ? 360 : 0
  return baseTarget + adjustment
}
