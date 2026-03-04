import { create } from "zustand"

export interface SolidColorState {
  color: string
  blur: number
  grain: number

  setColor: (c: string) => void
  setBlur: (b: number) => void
  setGrain: (g: number) => void
}

export const useSolidColorStore = create<SolidColorState>((set) => ({
  color: "#0f172a",
  blur: 0,
  grain: 0,

  setColor: (c) => set({ color: c }),
  setBlur: (b) => set({ blur: b }),
  setGrain: (g) => set({ grain: g }),
}))
