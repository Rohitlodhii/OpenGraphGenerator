import { create } from "zustand"

interface LayersPanelState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
}

export const useLayersPanelStore = create<LayersPanelState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
}))
