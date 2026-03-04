import { create } from "zustand"

interface BackgroundState {
  backgroundColor: string
  backgroundType: 'solid' | 'mesh' | 'image' | 'Svg Gradient'
  setBackgroundColor: (color: string) => void
  setBackgroundType: (type: 'solid' | 'mesh' | 'image' | 'Svg Gradient') => void
}

export const useBackgroundStore = create<BackgroundState>((set) => ({
  backgroundColor: "#111111",
  backgroundType: 'solid',
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setBackgroundType: (type) => set({ backgroundType: type }),
}))


