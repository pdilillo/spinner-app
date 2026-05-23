import { useCallback, useRef, useState } from 'react'
import type { SpinnerItem } from '../types'
import { computeTargetRotation } from '../utils/wheelGeometry'

export type SpinPhase = 'idle' | 'spinning' | 'result'

interface UseSpinWheelResult {
  rotation: number
  phase: SpinPhase
  winner: SpinnerItem | null
  spin: () => void
  onTransitionEnd: () => void
  reset: () => void
}

export function useSpinWheel(items: SpinnerItem[]): UseSpinWheelResult {
  const [rotation, setRotation] = useState(0)
  const [phase, setPhase] = useState<SpinPhase>('idle')
  const [winner, setWinner] = useState<SpinnerItem | null>(null)
  const rotationRef = useRef(0)

  const spin = useCallback(() => {
    if (items.length < 2 || phase !== 'idle') return

    const winnerIndex = Math.floor(Math.random() * items.length)
    const selected = items[winnerIndex]
    const fullSpins = 5 + Math.floor(Math.random() * 3)
    const target = computeTargetRotation(
      winnerIndex,
      items.length,
      rotationRef.current,
      fullSpins,
    )

    rotationRef.current = target
    setWinner(selected)
    setRotation(target)

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) {
      setPhase('result')
    } else {
      setPhase('spinning')
    }
  }, [items, phase])

  const onTransitionEnd = useCallback(() => {
    if (phase === 'spinning') {
      setPhase('result')
    }
  }, [phase])

  const reset = useCallback(() => {
    setPhase('idle')
    setWinner(null)
  }, [])

  return {
    rotation,
    phase,
    winner,
    spin,
    onTransitionEnd,
    reset,
  }
}
