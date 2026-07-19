import { create } from "zustand"
import type { DesignPayload } from "@/lib/design-payload"

const LIMIT = 100

interface HistoryState {
  past: DesignPayload[]
  present: DesignPayload | null
  future: DesignPayload[]
  // Set while a payload is being applied so the store subscriptions that
  // fire during restore don't get recorded as fresh edits.
  isApplying: boolean
  record: (snapshot: DesignPayload) => void
  undo: () => DesignPayload | null
  redo: () => DesignPayload | null
  setApplying: (value: boolean) => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: null,
  future: [],
  isApplying: false,

  record: (snapshot) =>
    set((state) => {
      // First snapshot just seeds the present with no history.
      if (state.present === null) {
        return { present: snapshot, past: [], future: [] }
      }
      const past = [...state.past, state.present]
      if (past.length > LIMIT) past.shift()
      return { past, present: snapshot, future: [] }
    }),

  undo: () => {
    const state = get()
    if (state.past.length === 0 || state.present === null) return null
    const previous = state.past[state.past.length - 1]
    set({
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    })
    return previous
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0 || state.present === null) return null
    const next = state.future[0]
    set({
      past: [...state.past, state.present],
      present: next,
      future: state.future.slice(1),
    })
    return next
  },

  setApplying: (value) => set({ isApplying: value }),
}))
