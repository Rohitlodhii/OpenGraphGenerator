export type ShapeGradientDirection =
  | "to-t"
  | "to-b"
  | "to-l"
  | "to-r"
  | "to-tr"
  | "to-tl"
  | "to-br"
  | "to-bl"
  | "radial"

export const SHAPE_GRADIENT_DIRECTIONS: { value: ShapeGradientDirection; label: string }[] = [
  { value: "to-b", label: "Top to Bottom" },
  { value: "to-t", label: "Bottom to Top" },
  { value: "to-r", label: "Left to Right" },
  { value: "to-l", label: "Right to Left" },
  { value: "to-br", label: "Top-Left to Bottom-Right" },
  { value: "to-bl", label: "Top-Right to Bottom-Left" },
  { value: "to-tr", label: "Bottom-Left to Top-Right" },
  { value: "to-tl", label: "Bottom-Right to Top-Left" },
  { value: "radial", label: "Radial" },
]

const CSS_SIDE: Record<Exclude<ShapeGradientDirection, "radial">, string> = {
  "to-b": "to bottom",
  "to-t": "to top",
  "to-r": "to right",
  "to-l": "to left",
  "to-br": "to bottom right",
  "to-bl": "to bottom left",
  "to-tr": "to top right",
  "to-tl": "to top left",
}

// Fixed even stops (0/100% for 2 colors, 0/50/100% for 3) — no per-stop
// position dragging (that's what made the old gradient editor laggy/buggy).
export const buildShapeGradientStops = (colors: string[]) =>
  colors
    .map((color, index) => `${color} ${colors.length > 1 ? (index / (colors.length - 1)) * 100 : 0}%`)
    .join(", ")

export const buildShapeGradientCss = (direction: ShapeGradientDirection, colors: string[]) => {
  const stops = buildShapeGradientStops(colors)
  if (direction === "radial") {
    return `radial-gradient(circle, ${stops})`
  }
  return `linear-gradient(${CSS_SIDE[direction]}, ${stops})`
}

// SVG gradients don't understand "to bottom" — they need an explicit vector
// in objectBoundingBox space (0-1). Used for the triangle shape, which is an
// SVG polygon rather than a CSS-backed div.
const SVG_VECTOR: Record<Exclude<ShapeGradientDirection, "radial">, { x1: string; y1: string; x2: string; y2: string }> = {
  "to-b": { x1: "0%", y1: "0%", x2: "0%", y2: "100%" },
  "to-t": { x1: "0%", y1: "100%", x2: "0%", y2: "0%" },
  "to-r": { x1: "0%", y1: "0%", x2: "100%", y2: "0%" },
  "to-l": { x1: "100%", y1: "0%", x2: "0%", y2: "0%" },
  "to-br": { x1: "0%", y1: "0%", x2: "100%", y2: "100%" },
  "to-bl": { x1: "100%", y1: "0%", x2: "0%", y2: "100%" },
  "to-tr": { x1: "0%", y1: "100%", x2: "100%", y2: "0%" },
  "to-tl": { x1: "100%", y1: "100%", x2: "0%", y2: "0%" },
}

export const getShapeGradientSvgVector = (direction: ShapeGradientDirection) =>
  direction === "radial" ? null : SVG_VECTOR[direction]
