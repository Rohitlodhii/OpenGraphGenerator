import { create } from "zustand"

type CurrentProjectState = {
  id: string | null
  name: string | null
  lastSavedAt: string | null
  setCurrent: (id: string, name: string, lastSavedAt?: string | null) => void
  markSaved: (lastSavedAt?: string) => void
  clear: () => void
}

// Tracks which saved project is currently open, so re-saving updates it
// in place instead of creating a new one. Cleared by "New project".
export const useCurrentProjectStore = create<CurrentProjectState>((set) => ({
  id: null,
  name: null,
  lastSavedAt: null,
  setCurrent: (id, name, lastSavedAt = null) => set({ id, name, lastSavedAt }),
  markSaved: (lastSavedAt = new Date().toISOString()) => set({ lastSavedAt }),
  clear: () => set({ id: null, name: null, lastSavedAt: null }),
}))
