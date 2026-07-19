import { create } from "zustand"

interface GradientState {
  // id of the applied library gradient, or null if none selected yet.
  appliedGradientId: string | null
  setAppliedGradient: (id: string | null) => void
}

export const useGradientStore = create<GradientState>((set) => ({
  appliedGradientId: null,
  setAppliedGradient: (id) => set({ appliedGradientId: id }),
}))
