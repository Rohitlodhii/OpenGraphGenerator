import { create } from "zustand"

export interface ImageState {
  src: string | null
  blur: number
  grain: number
  saturation: number
  contrast: number
  brightness: number
  opacity: number

  setSrc: (s: string | null) => void
  setBlur: (b: number) => void
  setGrain: (g: number) => void
  setSaturation: (s: number) => void
  setContrast: (c: number) => void
  setBrightness: (b: number) => void
  setOpacity: (o: number) => void
}

export const useImageStore = create<ImageState>((set) => ({
  src: null,
  blur: 0,
  grain: 0,
  saturation: 1,
  contrast: 1,
  brightness: 1,
  opacity: 100,

  setSrc: (s) => set({ src: s }),
  setBlur: (b) => set({ blur: b }),
  setGrain: (g) => set({ grain: g }),
  setSaturation: (s) => set({ saturation: s }),
  setContrast: (c) => set({ contrast: c }),
  setBrightness: (b) => set({ brightness: b }),
  setOpacity: (o) => set({ opacity: o }),
}))
