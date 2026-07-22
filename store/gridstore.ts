import { create } from "zustand"

interface GridState {
  gridVisible: boolean
  gridLines: number
  gridColor: string
  gridOpacity: number
  toggleGrid: () => void
  setGridVisible: (visible: boolean) => void
  setGridLines: (count: number) => void
  setGridColor: (color: string) => void
  setGridOpacity: (opacity: number) => void
}

export const useGridStore = create<GridState>((set) => ({
  gridVisible: false,
  gridLines: 6,
  gridColor: "#ffffff",
  gridOpacity: 40,
  toggleGrid: () => set((state) => ({ gridVisible: !state.gridVisible })),
  setGridVisible: (visible) => set({ gridVisible: visible }),
  setGridLines: (count) => set({ gridLines: count }),
  setGridColor: (color) => set({ gridColor: color }),
  setGridOpacity: (opacity) => set({ gridOpacity: opacity }),
}))
