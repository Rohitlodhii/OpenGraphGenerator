import { create } from "zustand"
import type { SvgNode, DefEntry } from "@/lib/svg-import"
import type { CssGradientLayer } from "@/lib/css-presets"
import type { ShapeGradientDirection } from "@/lib/shape-gradient"

export type CanvasObjectType = "text" | "image" | "svg" | "pattern" | "blob" | "motif" | "importedSvg" | "mockup" | "ascii" | "cssPreset"
export type CanvasShapeType = "circle" | "rectangle" | "triangle" | "square" | "line"
export type CanvasTextAlign = "left" | "center" | "right" | "justify"
export type CanvasPatternType =
  | "dots"
  | "grid"
  | "cross"
  | "diagonal"
  | "horizontal"
  | "vertical"
  | "gradient-grid-right"
  | "gradient-grid-left"
  | "dual-gradient-grid"
  | "top-fade-grid"
  | "bottom-fade-grid"
  | "center-fade-grid"
  | "diagonal-cross-grid"
  | "diagonal-cross-fade"
  | "dashed-grid"
  | "dashed-center-fade"
  | "circuit-board"
  | "zigzag-lightning"
  | "grid-with-dots"
  | "colored-noise"
  | "striped-grid-spotlight"

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
  // Simple gradient fill for shapes (rectangle/square/circle/triangle/line).
  // 2-3 colors, fixed even stops, no opacity per stop — deliberately simpler
  // than the free-position gradient editor, which was laggy and buggy here.
  shapeFillMode?: "solid" | "gradient"
  shapeGradientDirection?: ShapeGradientDirection
  shapeGradientColors?: string[]
  shapeBorderRadius?: number
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
  imageOpacity?: number
  imageStrokeColor?: string
  imageStrokeWidth?: number
  imageBorderRadius?: number
  imageAssetId?: string
  imageFileName?: string
  imageFileSize?: number
  imageMimeType?: string
  imageRemoteUrl?: string
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
  // Mockup fields (device frames — iPhone, iPad, Mac, Safari). The embedded
  // screenshot reuses `src`; the empty screen tint reuses `fill`.
  mockupId?: string
  mockupUrl?: string
  mockupImageFit?: "cover" | "contain"
  mockupTheme?: "light" | "dark"
  // ASCII-art fields. The source image reuses `src`; the rest configure the
  // AsciiArt renderer (see components/ui/ascii-art.tsx).
  asciiResolution?: number
  asciiCharset?: string
  asciiColor?: string
  asciiBackgroundColor?: string
  asciiInverted?: boolean
  asciiColored?: boolean
  asciiAnimationStyle?: "fade" | "typewriter" | "matrix" | "none"
  asciiObjectFit?: "cover" | "contain" | "fill"
  // CSS preset fields (pattern backgrounds, radial glows, gradient decorations).
  // The preset's Tailwind wrapper classes and inline background style are stored
  // verbatim so the on-canvas object reproduces the source preset exactly.
  presetKind?: "patternBg" | "radialGlow" | "gradientDecoration"
  presetId?: string
  cssWrapperClassName?: string
  cssStyle?: Record<string, string>
  cssBackgroundColor?: string
  cssBackgroundEnabled?: boolean
  cssGradientLayers?: CssGradientLayer[]
  cssOverlayColor?: string
  cssGrain?: number
  cssBlur?: number
  cssOpacity?: number
  cssRadius?: number
}

interface CanvasState {
  objects: CanvasObject[]
  selectedObjectId: string | null
  addObject: (object: CanvasObject) => void
  updateObject: (id: string, updates: Partial<CanvasObject>) => void
  removeObject: (id: string) => void
  duplicateObject: (id: string) => void
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

const createObjectId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `object-${Date.now()}-${Math.floor(Math.random() * 100000)}`
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

  // Copies an object with a fresh id, nudged slightly so it doesn't sit
  // exactly on top of the original, and raised above every existing object.
  duplicateObject: (id) =>
    set((state) => {
      const source = state.objects.find((object) => object.id === id)
      if (!source) return state
      const maxZIndex = state.objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
      const duplicate: CanvasObject = {
        ...source,
        id: createObjectId(),
        x: source.x + 24,
        y: source.y + 24,
        zIndex: maxZIndex + 1,
      }
      return {
        objects: [...state.objects, duplicate],
        selectedObjectId: duplicate.id,
      }
    }),

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
