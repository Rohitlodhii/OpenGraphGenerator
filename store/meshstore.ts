import { create } from "zustand"

export interface Blob {
  x: number
  y: number
  radius: number
  color: string
  opacity: number
  visible: boolean
}

// sheet state holds the configuration for the mesh preview
export interface MeshState {
  baseColor: string
  blobs: Blob[]           // each blob has a fixed position and color
  blur: number
  grain: number

  setBaseColor: (c: string) => void
  addBlob: (c: string) => void
  removeBlob: (index: number) => void
  updateBlob: (index: number, patch: Partial<Blob>) => void
  setBlur: (b: number) => void
  setGrain: (g: number) => void
}



export const randomPosition = () => ({
  x: Math.random(),
  y: Math.random(),
  radius: 300 + Math.random() * 400,
})

export const randomBlob = (color: string): Blob => ({
  ...randomPosition(),
  color,
  opacity: 1,
  visible: true,
})

export const useMeshStore = create<MeshState>((set, get) => ({
  baseColor: "#0f172a",
  blobs: [
    randomBlob("#0091ff"),
    randomBlob("#4dd091"),
    randomBlob("#002b50"),
  ],
  blur: 150,
  grain: 0.1,

  setBaseColor: (c) => set({ baseColor: c }),

  addBlob: (c) =>
    set((state) => ({ blobs: [...state.blobs, randomBlob(c)] })),

  removeBlob: (index) => {
    const { blobs } = get()
    set({ blobs: blobs.filter((_, i) => i !== index) })
  },

  updateBlob: (index, patch) => {
    const { blobs } = get()
    const updated = [...blobs]
    updated[index] = { ...updated[index], ...patch }
    set({ blobs: updated })
  },

  setBlur: (b) => set({ blur: b }),
  setGrain: (g) => set({ grain: g }),
}))