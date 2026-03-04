import { create } from "zustand"

export type CanvasObjectType = "text" | "image" | "svg"

export interface CanvasObject {
  id: string
  type: CanvasObjectType
  x: number
  y: number
  width?: number
  height?: number
  content?: string
  src?: string
  rotation?: number
  zIndex?: number
}

interface CanvasState {
  objects: CanvasObject[]
  addObject: (object: CanvasObject) => void
  updateObject: (id: string, updates: Partial<CanvasObject>) => void
  removeObject: (id: string) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  objects: [],

  addObject: (object) =>
    set((state) => ({
      objects: [...state.objects, object],
    })),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((object) =>
        object.id === id ? { ...object, ...updates } : object,
      ),
    })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((object) => object.id !== id),
    })),
}))

