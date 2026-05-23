import { useEffect, useRef } from 'react'
import type { SpinnerItem } from '../types'
import {
  describeSegmentPath,
  getLabelPosition,
  getSegmentAngle,
  getSegmentColor,
  truncateLabel,
} from '../utils/wheelGeometry'

interface SpinWheelProps {
  items: SpinnerItem[]
  rotation: number
  spinning: boolean
  onTransitionEnd: () => void
}

const CX = 100
const CY = 100
const RADIUS = 92

export function SpinWheel({
  items,
  rotation,
  spinning,
  onTransitionEnd,
}: SpinWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const el = wheelRef.current
    if (!el) return

    const handleEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'transform') {
        onTransitionEnd()
      }
    }

    el.addEventListener('transitionend', handleEnd)
    return () => el.removeEventListener('transitionend', handleEnd)
  }, [onTransitionEnd])

  if (items.length === 0) {
    return (
      <div className="flex aspect-square w-full max-w-md items-center justify-center rounded-full border-2 border-dashed border-slate-700 bg-slate-900/50">
        <p className="px-6 text-center text-sm text-slate-500">
          Add items to see your wheel
        </p>
      </div>
    )
  }

  const segmentAngle = getSegmentAngle(items.length)
  const transitionClass = reducedMotion.current
    ? 'spin-wheel-transition-reduced'
    : 'spin-wheel-transition'

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
        aria-hidden="true"
      >
        <div className="h-0 w-0 border-x-[14px] border-x-transparent border-t-[24px] border-t-white drop-shadow-lg" />
      </div>

      <div
        ref={wheelRef}
        className={`aspect-square w-full ${spinning || rotation > 0 ? transitionClass : ''}`}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <svg
          viewBox="0 0 200 200"
          className="h-full w-full drop-shadow-2xl"
          role="img"
          aria-label={`Spinning wheel with ${items.length} options`}
        >
          {items.map((item, index) => {
            const startAngle = index * segmentAngle
            const endAngle = (index + 1) * segmentAngle
            const midAngle = startAngle + segmentAngle / 2
            const path = describeSegmentPath(CX, CY, RADIUS, startAngle, endAngle)
            const label = getLabelPosition(CX, CY, RADIUS, midAngle)

            return (
              <g key={item.id}>
                <path
                  d={path}
                  fill={getSegmentColor(index)}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />
                <text
                  x={label.x}
                  y={label.y}
                  fill="white"
                  fontSize={items.length > 12 ? 7 : items.length > 8 ? 8 : 10}
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${label.rotation}, ${label.x}, ${label.y})`}
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                  {truncateLabel(item.label, items.length > 12 ? 10 : 14)}
                </text>
              </g>
            )
          })}
          <circle cx={CX} cy={CY} r={12} fill="#1e293b" stroke="#475569" strokeWidth="2" />
          <circle cx={CX} cy={CY} r={5} fill="#e2e8f0" />
        </svg>
      </div>
    </div>
  )
}
