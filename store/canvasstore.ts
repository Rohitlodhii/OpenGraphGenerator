import { create } from "zustand"

export type CanvasObjectType = "text" | "image" | "svg"
export type CanvasShapeType = "circle" | "rectangle" | "triangle" | "square"
export type CanvasTextAlign = "left" | "center" | "right" | "justify"

export interface CanvasObject {
  id: string
  type: CanvasObjectType | "shape"
  x: number
  y: number
  width?: number
  height?: number
  content?: string
  src?: string
  rotation?: number
  zIndex?: number
  shapeType?: CanvasShapeType
  fill?: string
  shapeOpacity?: number
  blur?: number
  shapeShadow?: number
  shapeShadowColor?: string
  strokeColor?: string
  strokeWidth?: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: number
  lineHeight?: number
  letterSpacing?: number
  fontOpacity?: number
  fontStyle?: "normal" | "italic"
  textDecoration?: "none" | "underline"
  textAlign?: CanvasTextAlign
  textIndent?: number
  textColor?: string
  textShadow?: number
  textShadowColor?: string
  imageCropX?: number
  imageCropY?: number
  imageCropScale?: number
}

interface CanvasState {
  objects: CanvasObject[]
  selectedObjectId: string | null
  addObject: (object: CanvasObject) => void
  updateObject: (id: string, updates: Partial<CanvasObject>) => void
  removeObject: (id: string) => void
  setSelectedObjectId: (id: string | null) => void
}

export const useCanvasStore = create<CanvasState>((set) => ({
  objects: [],
  selectedObjectId: null,

  addObject: (object) =>
    set((state) => ({
      objects: [...state.objects, object],
      selectedObjectId: object.id,
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
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),

  setSelectedObjectId: (id) => set({ selectedObjectId: id }),
}))
