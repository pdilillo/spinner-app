import { useEffect, useState } from 'react'
import { useCelebrationSound } from '../hooks/useCelebrationSound'
import { useSpinWheel } from '../hooks/useSpinWheel'
import { useSpinnerStore } from '../store/useSpinnerStore'
import { Confetti } from './Confetti'
import { ItemList } from './ItemList'
import { ResultModal } from './ResultModal'
import { SoundToggle } from './SoundToggle'
import { SpinWheel } from './SpinWheel'

export function ListEditor() {
  const activeListId = useSpinnerStore((s) => s.activeListId)
  const lists = useSpinnerStore((s) => s.lists)
  const setActiveList = useSpinnerStore((s) => s.setActiveList)
  const addItem = useSpinnerStore((s) => s.addItem)
  const removeItem = useSpinnerStore((s) => s.removeItem)
  const soundEnabled = useSpinnerStore((s) => s.settings.soundEnabled)

  const list = lists.find((l) => l.id === activeListId)
  const [newItemLabel, setNewItemLabel] = useState('')

  const { rotation, phase, winner, spin, onTransitionEnd, reset } = useSpinWheel(
    list?.items ?? [],
  )
  const { play } = useCelebrationSound(soundEnabled)

  useEffect(() => {
    if (phase === 'result') {
      play()
    }
  }, [phase, play])

  useEffect(() => {
    if (activeListId && !list) {
      setActiveList(null)
    }
  }, [activeListId, list, setActiveList])

  if (!list) {
    return null
  }

  const isSpinning = phase === 'spinning'
  const isLocked = phase !== 'idle'
  const canSpin = list.items.length >= 2 && !isLocked

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemLabel.trim() || isLocked) return
    addItem(list.id, newItemLabel)
    setNewItemLabel('')
  }

  const handleRemoveWinner = () => {
    if (winner) {
      removeItem(list.id, winner.id)
    }
    reset()
  }

  const handleKeepWinner = () => {
    reset()
  }

  const handleTransitionEnd = () => {
    onTransitionEnd()
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setActiveList(null)}
            disabled={isSpinning}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{list.name}</h1>
            <p className="text-sm text-slate-400">
              {list.items.length} {list.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
        </div>
        <SoundToggle />
      </header>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
        <section aria-label="Item management">
          <h2 className="mb-4 text-lg font-semibold text-slate-200">Items</h2>
          <form onSubmit={handleAddItem} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              placeholder="Add an option..."
              disabled={isLocked}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
              aria-label="New item label"
            />
            <button
              type="submit"
              disabled={!newItemLabel.trim() || isLocked}
              className="rounded-xl bg-slate-700 px-4 py-3 font-medium text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </form>

          <ItemList
            items={list.items}
            disabled={isLocked}
            onRemove={(itemId) => removeItem(list.id, itemId)}
          />

          {list.items.length === 1 && (
            <p className="mt-3 text-sm text-amber-400/90">
              Add one more item to enable spinning.
            </p>
          )}
        </section>

        <section aria-label="Spin wheel" className="flex flex-col items-center">
          <SpinWheel
            items={list.items}
            rotation={rotation}
            spinning={isSpinning}
            onTransitionEnd={handleTransitionEnd}
          />

          <button
            type="button"
            onClick={spin}
            disabled={!canSpin}
            className="mt-8 w-full max-w-xs rounded-2xl bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 hover:shadow-indigo-800/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none sm:w-auto"
          >
            {isSpinning ? 'Spinning…' : 'SPIN'}
          </button>

          {!canSpin && list.items.length >= 2 && phase === 'result' && (
            <p className="mt-3 text-sm text-slate-500">
              Choose keep or remove before spinning again.
            </p>
          )}
        </section>
      </div>

      <Confetti active={phase === 'result'} />
      <ResultModal
        winner={winner}
        open={phase === 'result'}
        onRemove={handleRemoveWinner}
        onKeep={handleKeepWinner}
      />
    </div>
  )
}
