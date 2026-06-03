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

/** Center angle of a segment (0° = top / pointer). */
export function getSegmentCenterAngle(index: number, itemCount: number): number {
  return index * getSegmentAngle(itemCount)
}

/** Rotation (mod 360) that places a segment center under the pointer. */
export function getRotationForSegmentCenter(
  index: number,
  itemCount: number,
): number {
  const center = getSegmentCenterAngle(index, itemCount)
  return (360 - center) % 360
}

/** Idle wheel pose: first segment centered at the pointer. */
export function getIdleRotation(_itemCount: number): number {
  return 0
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

export function getLabelMaxLength(itemCount: number): number {
  if (itemCount > 16) return 4
  if (itemCount > 12) return 6
  if (itemCount > 8) return 10
  if (itemCount > 6) return 12
  return 16
}

function abbreviateWord(word: string, maxLen: number): string {
  if (word.length <= maxLen) return word
  if (maxLen <= 1) return word[0] ?? ''
  return `${word.slice(0, maxLen - 1)}.`
}

export function abbreviateLabel(label: string, maxLength = 14): string {
  const trimmed = label.trim()
  if (!trimmed || trimmed.length <= maxLength) return trimmed

  const words = trimmed.split(/\s+/).filter(Boolean)

  if (words.length === 1) {
    if (maxLength <= 2) return trimmed.slice(0, maxLength)
    return abbreviateWord(trimmed, maxLength)
  }

  const initials = words.map((w) => w[0]?.toUpperCase() ?? '').join('')
  if (initials.length <= maxLength) return initials

  const perWordMax = Math.max(
    2,
    Math.floor((maxLength - (words.length - 1)) / words.length),
  )
  const shortenedWords = words.map((w) => abbreviateWord(w, perWordMax)).join(' ')
  if (shortenedWords.length <= maxLength) return shortenedWords

  const dotted = words.map((w) => `${w[0]?.toUpperCase() ?? ''}.`).join(' ')
  if (dotted.length <= maxLength) return dotted

  if (initials.length > maxLength) return initials.slice(0, maxLength)
  return abbreviateWord(trimmed.replace(/\s+/g, ''), maxLength)
}

export function computeTargetRotation(
  winnerIndex: number,
  itemCount: number,
  currentRotation: number,
  fullSpins = 5,
): number {
  const winnerCenter = getSegmentCenterAngle(winnerIndex, itemCount)
  const minRotation = currentRotation + fullSpins * 360
  const baseTarget = minRotation + (360 - winnerCenter)
  const currentMod = currentRotation % 360
  const targetMod = baseTarget % 360
  const adjustment = targetMod <= currentMod ? 360 : 0
  return baseTarget + adjustment
}
