import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  color: string
  size: number
}

const COLORS = ['#6366f1', '#ec4899', '#eab308', '#22c55e', '#06b6d4', '#f97316']

interface ConfettiProps {
  active: boolean
}

export function Confetti({ active }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    if (!active) {
      setPieces([])
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (prefersReducedMotion) return

    setPieces(
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 8,
      })),
    )
  }, [active])

  if (pieces.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece absolute top-0 block rounded-sm opacity-90"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size * 1.4,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .confetti-piece {
          animation: confetti-fall 2.2s ease-in forwards;
        }
      `}</style>
    </div>
  )
}
