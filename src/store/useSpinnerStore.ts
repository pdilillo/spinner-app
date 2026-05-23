import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SpinnerList } from '../types'
import { createId } from '../utils/id'

interface SpinnerState {
  lists: SpinnerList[]
  activeListId: string | null
  settings: {
    soundEnabled: boolean
    lastActiveListId: string | null
  }
  createList: (name: string) => string
  deleteList: (listId: string) => void
  renameList: (listId: string, name: string) => void
  setActiveList: (listId: string | null) => void
  addItem: (listId: string, label: string) => void
  removeItem: (listId: string, itemId: string) => void
  toggleSound: () => void
  getActiveList: () => SpinnerList | undefined
}

export const useSpinnerStore = create<SpinnerState>()(
  persist(
    (set, get) => ({
      lists: [],
      activeListId: null,
      settings: {
        soundEnabled: true,
        lastActiveListId: null,
      },

      createList: (name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return ''

        const now = new Date().toISOString()
        const id = createId()
        const newList: SpinnerList = {
          id,
          name: trimmed,
          items: [],
          createdAt: now,
          updatedAt: now,
        }

        set((state) => ({
          lists: [...state.lists, newList],
          activeListId: id,
          settings: { ...state.settings, lastActiveListId: id },
        }))

        return id
      },

      deleteList: (listId: string) => {
        set((state) => {
          const lists = state.lists.filter((l) => l.id !== listId)
          const activeListId =
            state.activeListId === listId ? null : state.activeListId
          return {
            lists,
            activeListId,
            settings: {
              ...state.settings,
              lastActiveListId:
                state.settings.lastActiveListId === listId
                  ? null
                  : state.settings.lastActiveListId,
            },
          }
        })
      },

      renameList: (listId: string, name: string) => {
        const trimmed = name.trim()
        if (!trimmed) return

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? { ...list, name: trimmed, updatedAt: new Date().toISOString() }
              : list,
          ),
        }))
      },

      setActiveList: (listId: string | null) => {
        set((state) => ({
          activeListId: listId,
          settings: { ...state.settings, lastActiveListId: listId },
        }))
      },

      addItem: (listId: string, label: string) => {
        const trimmed = label.trim()
        if (!trimmed) return

        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  updatedAt: new Date().toISOString(),
                  items: [
                    ...list.items,
                    { id: createId(), label: trimmed },
                  ],
                }
              : list,
          ),
        }))
      },

      removeItem: (listId: string, itemId: string) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  updatedAt: new Date().toISOString(),
                  items: list.items.filter((item) => item.id !== itemId),
                }
              : list,
          ),
        }))
      },

      toggleSound: () => {
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled,
          },
        }))
      },

      getActiveList: () => {
        const { lists, activeListId } = get()
        return lists.find((l) => l.id === activeListId)
      },
    }),
    {
      name: 'spinner-app-v1',
    },
  ),
)
