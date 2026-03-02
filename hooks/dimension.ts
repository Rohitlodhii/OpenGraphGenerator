import { create } from "zustand"

type DimensionState = {
  width: number // in px
  height: number // in px
  setWidth: (w: number) => void
  setHeight: (h: number) => void
  set: (width: number, height: number) => void
  setDimensions: (dims: { width: number; height: number }) => void
  reset: () => void
  widthPx: () => string
  heightPx: () => string
}

export const useDimensionStore = create<DimensionState>((set, get) => ({
  // defaults match the previewer target size
  width: 1200,
  height: 630,

  setWidth: (w: number) => set({ width: Math.round(w) }),
  setHeight: (h: number) => set({ height: Math.round(h) }),

  set: (width: number, height: number) =>
    set({ width: Math.round(width), height: Math.round(height) }),

  setDimensions: (dims: { width: number; height: number }) =>
    set({ width: Math.round(dims.width), height: Math.round(dims.height) }),

  reset: () => set({ width: 1200, height: 630 }),

  widthPx: () => `${get().width}px`,
  heightPx: () => `${get().height}px`,
}))

export default useDimensionStore
