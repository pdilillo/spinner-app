export interface SpinnerItem {
  id: string
  label: string
}

export interface SpinnerList {
  id: string
  name: string
  items: SpinnerItem[]
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  soundEnabled: boolean
  lastActiveListId: string | null
}

export interface AppStore {
  lists: SpinnerList[]
  activeListId: string | null
  settings: AppSettings
}
