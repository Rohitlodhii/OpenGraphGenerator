import { create } from "zustand"

type CurrentProjectState = {
  id: string | null
  name: string | null
  setCurrent: (id: string, name: string) => void
  clear: () => void
}

// Tracks which saved project is currently open, so re-saving updates it
// in place instead of creating a new one. Cleared by "New project".
export const useCurrentProjectStore = create<CurrentProjectState>((set) => ({
  id: null,
  name: null,
  setCurrent: (id, name) => set({ id, name }),
  clear: () => set({ id: null, name: null }),
}))
