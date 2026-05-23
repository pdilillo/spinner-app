import { useCallback, useRef } from 'react'

export function useCelebrationSound(enabled: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    return audioContextRef.current
  }, [])

  const play = useCallback(() => {
    if (!enabled) return

    try {
      const ctx = getContext()
      if (ctx.state === 'suspended') {
        void ctx.resume()
      }

      const now = ctx.currentTime

      const notes = [
        { freq: 523.25, start: 0, duration: 0.15 },
        { freq: 659.25, start: 0.1, duration: 0.15 },
        { freq: 783.99, start: 0.2, duration: 0.15 },
        { freq: 1046.5, start: 0.3, duration: 0.4 },
      ]

      notes.forEach(({ freq, start, duration }) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.value = freq

        gain.gain.setValueAtTime(0, now + start)
        gain.gain.linearRampToValueAtTime(0.18, now + start + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + start)
        osc.stop(now + start + duration)
      })
    } catch {
      // Audio may be unavailable in some environments
    }
  }, [enabled, getContext])

  return { play }
}
