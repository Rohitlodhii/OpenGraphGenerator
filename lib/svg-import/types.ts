// Internal object model for the SVG import pipeline. This is the editable model
// a parsed SVG becomes — distinct from the placed-canvas `CanvasObject` in
// store/canvasstore.ts. Named `SvgNode` to avoid the name clash.

export interface Point {
  x: number
  y: number
}

export type Matrix6 = [number, number, number, number, number, number]

export type SvgNodeType =
  | "group"
  | "rect"
  | "circle"
  | "ellipse"
  | "line"
  | "polygon"
  | "polyline"
  | "path"
  | "text"
  | "image"

export interface PathCommand {
  code: string
  relative: boolean
  end?: Point
  // Bezier / arc control points, kept loose since d-path-parser shapes vary.
  [key: string]: unknown
}

export interface ResolvedStyle {
  fill?: string
  fillOpacity?: number
  stroke?: string
  strokeWidth?: number
  strokeOpacity?: number
  strokeLinecap?: string
  strokeLinejoin?: string
  strokeDasharray?: string
  // Inherited color context for `currentColor` resolution.
  color?: string
}

export interface SvgNodeData {
  // circle
  radius?: number
  // ellipse
  rx?: number
  ry?: number
  // line
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  // path
  path?: string
  pathCommands?: PathCommand[]
  // polygon / polyline
  points?: Point[]
  // rect corner radii
  rectRx?: number
  rectRy?: number
  // text
  text?: string
  fontFamily?: string
  fontSize?: number
  fontWeight?: string | number
  textAnchor?: "start" | "middle" | "end"
  // image
  imageUrl?: string
  imageWidth?: number
  imageHeight?: number
}

export interface SvgNode {
  id: string
  type: SvgNodeType
  name?: string

  x: number
  y: number
  width?: number
  height?: number
  rotation: number
  scaleX: number
  scaleY: number

  visible: boolean
  locked?: boolean
  degenerate?: boolean

  opacity: number
  style: ResolvedStyle

  data?: SvgNodeData

  // Preserved when a transform can't be cleanly decomposed (shear/non-affine).
  transformMatrix?: Matrix6
  hasComplexTransform?: boolean

  // References to defs (resolved later by the renderer).
  clipPathRef?: string
  maskRef?: string

  children?: SvgNode[]

  svgSource?: {
    elementName: string
    originalAttributes: Record<string, string>
  }
}

// ---- Defs (gradients / clipPath / mask) ----

export interface GradientStop {
  offset: number
  color: string
  opacity: number
}

export interface GradientDef {
  kind: "linearGradient" | "radialGradient"
  id: string
  stops: GradientStop[]
  gradientTransform?: Matrix6
  // Raw coordinate attributes preserved for the renderer.
  coords: Record<string, string>
  gradientUnits?: string
  href?: string
}

export interface ClipOrMaskDef {
  kind: "clipPath" | "mask"
  id: string
  children: SvgNode[]
}

export type DefEntry = GradientDef | ClipOrMaskDef

// ---- Context / result ----

export interface ImportWarning {
  code: string
  message: string
  elementName?: string
}

export interface ImportOptions {
  flattenGroups?: boolean
  preserveIds?: boolean
  ignoreUnsupported?: boolean
  onWarning?: (warning: ImportWarning) => void
}

export interface ImportStats {
  elementCount: number
  unsupportedElements: string[]
  parseTimeMs: number
}

export interface ImportResult {
  success: boolean
  root: SvgNode | null
  viewBox: { x: number; y: number; width: number; height: number } | null
  defs: Record<string, DefEntry>
  warnings: ImportWarning[]
  stats: ImportStats
  error?: string
}

// ---- svgson AST node ----

export interface SvgsonNode {
  name: string
  type: string
  value?: string
  attributes: Record<string, string>
  children: SvgsonNode[]
}
