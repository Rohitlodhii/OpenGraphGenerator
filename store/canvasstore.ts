import { create } from "zustand"
import type { SvgNode, DefEntry } from "@/lib/svg-import"

export type CanvasObjectType = "text" | "image" | "svg" | "pattern" | "blob" | "motif" | "importedSvg"
export type CanvasShapeType = "circle" | "rectangle" | "triangle" | "square"
export type CanvasTextAlign = "left" | "center" | "right" | "justify"
export type CanvasPatternType =
  | "dots"
  | "grid"
  | "cross"
  | "diagonal"
  | "horizontal"
  | "vertical"

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
  hidden?: boolean
  shapeType?: CanvasShapeType
  fill?: string
  shapeOpacity?: number
  blur?: number
  shapeShadow?: number
  shapeShadowColor?: string
  strokeColor?: string
  strokeWidth?: number
  patternType?: CanvasPatternType
  patternColor?: string
  patternScale?: number
  patternOpacity?: number
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
  imageBlendMode?: string
  imageGrain?: number
  imageBlur?: number
  imageStrokeColor?: string
  imageStrokeWidth?: number
  imageBorderRadius?: number
  // Blob fields
  blobId?: string
  blobGrain?: number
  // Motif fields
  motifId?: string
  motifGrain?: number
  // Imported-SVG fields
  svgTree?: SvgNode
  svgViewBox?: { x: number; y: number; width: number; height: number } | null
  svgDefs?: Record<string, DefEntry>
}

interface CanvasState {
  objects: CanvasObject[]
  selectedObjectId: string | null
  addObject: (object: CanvasObject) => void
  updateObject: (id: string, updates: Partial<CanvasObject>) => void
  removeObject: (id: string) => void
  setSelectedObjectId: (id: string | null) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  toggleObjectHidden: (id: string) => void
  reorderObjects: (orderedIds: string[]) => void
}

const orderObjects = (objects: CanvasObject[]) =>
  objects
    .map((object, index) => ({ object, index }))
    .sort((a, b) => {
      const az = a.object.zIndex ?? 0
      const bz = b.object.zIndex ?? 0
      if (az === bz) return a.index - b.index
      return az - bz
    })
    .map((entry) => entry.object)

// Reassigns sequential zIndex values (1..n, bottom-to-top) to every object
// based on `ordered`, so the persisted stacking order matches exactly.
const applyOrder = (ordered: CanvasObject[]) => {
  const zIndexById = new Map<string, number>()
  ordered.forEach((object, index) => zIndexById.set(object.id, index + 1))
  return (objects: CanvasObject[]) =>
    objects.map((object) => ({
      ...object,
      zIndex: zIndexById.get(object.id) ?? object.zIndex,
    }))
}

const moveObject = (objects: CanvasObject[], id: string, delta: number) => {
  const ordered = orderObjects(objects)
  const from = ordered.findIndex((object) => object.id === id)
  if (from < 0) return objects
  const to = from + delta
  if (to < 0 || to >= ordered.length) return objects
  const reordered = [...ordered]
  const [moved] = reordered.splice(from, 1)
  reordered.splice(to, 0, moved)
  return applyOrder(reordered)(objects)
}

const moveObjectToEnd = (objects: CanvasObject[], id: string, toTop: boolean) => {
  const ordered = orderObjects(objects)
  const from = ordered.findIndex((object) => object.id === id)
  if (from < 0) return objects
  const reordered = [...ordered]
  const [moved] = reordered.splice(from, 1)
  if (toTop) {
    reordered.push(moved)
  } else {
    reordered.unshift(moved)
  }
  return applyOrder(reordered)(objects)
}

// Returns objects sorted bottom-to-top by stacking order (zIndex, then
// insertion order). Exported for the global layers panel.
export const getStackingOrder = (objects: CanvasObject[]) => orderObjects(objects)

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

  bringForward: (id) =>
    set((state) => ({ objects: moveObject(state.objects, id, 1) })),

  sendBackward: (id) =>
    set((state) => ({ objects: moveObject(state.objects, id, -1) })),

  bringToFront: (id) =>
    set((state) => ({ objects: moveObjectToEnd(state.objects, id, true) })),

  sendToBack: (id) =>
    set((state) => ({ objects: moveObjectToEnd(state.objects, id, false) })),

  toggleObjectHidden: (id) =>
    set((state) => ({
      objects: state.objects.map((object) =>
        object.id === id ? { ...object, hidden: !object.hidden } : object,
      ),
    })),

  // Reassigns stacking order from an explicit top-to-bottom list of ids (as
  // shown in the layers panel). Ids not present keep their relative order below.
  reorderObjects: (orderedIds) =>
    set((state) => {
      // orderedIds is top-to-bottom; zIndex is bottom-to-top, so reverse it.
      const bottomToTop = [...orderedIds].reverse()
      const zIndexById = new Map<string, number>()
      bottomToTop.forEach((id, index) => zIndexById.set(id, index + 1))
      return {
        objects: state.objects.map((object) => ({
          ...object,
          zIndex: zIndexById.get(object.id) ?? object.zIndex,
        })),
      }
    }),
}))
