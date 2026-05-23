import type { SpinnerItem } from '../types'

interface ItemListProps {
  items: SpinnerItem[]
  disabled?: boolean
  onRemove: (itemId: string) => void
}

export function ItemList({ items, disabled = false, onRemove }: ItemListProps) {
  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-700 px-4 py-8 text-center text-sm text-slate-500">
        Add at least 2 items to spin the wheel.
      </p>
    )
  }

  return (
    <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3"
        >
          <span className="min-w-0 flex-1 truncate text-slate-200">
            <span className="mr-2 text-slate-500">{index + 1}.</span>
            {item.label}
          </span>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            disabled={disabled}
            className="shrink-0 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-slate-800 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Remove ${item.label}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
