import { useState } from 'react'
import { useSpinnerStore } from '../store/useSpinnerStore'

export function ListHub() {
  const lists = useSpinnerStore((s) => s.lists)
  const createList = useSpinnerStore((s) => s.createList)
  const deleteList = useSpinnerStore((s) => s.deleteList)
  const setActiveList = useSpinnerStore((s) => s.setActiveList)

  const [newListName, setNewListName] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const id = createList(newListName)
    if (id) {
      setNewListName('')
      setActiveList(id)
    }
  }

  const handleDelete = (listId: string) => {
    deleteList(listId)
    setConfirmDeleteId(null)
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Spin Decide
        </h1>
        <p className="mt-2 text-slate-400">
          Create lists, add options, and spin the wheel to choose.
        </p>
      </header>

      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name (e.g. Movies, Dinners)"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          aria-label="New list name"
        />
        <button
          type="submit"
          disabled={!newListName.trim()}
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          + New list
        </button>
      </form>

      {lists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-16 text-center">
          <p className="text-lg text-slate-300">No lists yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Create your first list above to get started.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {lists.map((list) => (
            <li
              key={list.id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900"
            >
              <button
                type="button"
                onClick={() => setActiveList(list.id)}
                className="w-full text-left"
              >
                <h2 className="text-xl font-semibold text-white">{list.name}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {list.items.length}{' '}
                  {list.items.length === 1 ? 'item' : 'items'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setConfirmDeleteId(list.id)}
                className="absolute right-4 top-4 rounded-lg px-2 py-1 text-sm text-slate-500 opacity-0 transition hover:bg-slate-800 hover:text-red-400 group-hover:opacity-100"
                aria-label={`Delete ${list.name}`}
              >
                Delete
              </button>

              {confirmDeleteId === list.id && (
                <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/30 p-3">
                  <p className="text-sm text-red-200">
                    Delete &ldquo;{list.name}&rdquo; and all its items?
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(list.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded-lg border border-slate-600 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
