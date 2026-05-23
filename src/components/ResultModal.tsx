import { useEffect, useRef } from 'react'
import type { SpinnerItem } from '../types'

interface ResultModalProps {
  winner: SpinnerItem | null
  open: boolean
  onRemove: () => void
  onKeep: () => void
}

export function ResultModal({ winner, open, onRemove, onKeep }: ResultModalProps) {
  const removeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      removeRef.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onKeep()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onKeep])

  if (!open || !winner) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center shadow-2xl">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
          The wheel chose
        </p>
        <h2
          id="result-title"
          className="mt-3 break-words text-3xl font-bold text-white"
        >
          {winner.label}
        </h2>
        <p className="mt-4 text-sm text-slate-400">
          Remove it from the list or keep it for another spin.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            ref={removeRef}
            type="button"
            onClick={onRemove}
            className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-500"
          >
            Remove from list
          </button>
          <button
            type="button"
            onClick={onKeep}
            className="rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 font-semibold text-white transition hover:border-slate-500 hover:bg-slate-700"
          >
            Keep &amp; spin again
          </button>
        </div>
      </div>
    </div>
  )
}
