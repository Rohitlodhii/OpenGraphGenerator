import type { CanvasPatternType } from "@/store/canvasstore"

// SVG tiling-pattern definitions. Each builds a <pattern> tile of `size` px at a
// given color; rendered as a repeating background that sits above the canvas
// background but participates in the normal object layering system.

export type PatternDef = {
  type: CanvasPatternType
  label: string
}

export const PATTERNS: PatternDef[] = [
  { type: "dots", label: "Dots" },
  { type: "grid", label: "Grid" },
  { type: "cross", label: "Cross" },
  { type: "diagonal", label: "Diagonal" },
  { type: "horizontal", label: "Horizontal" },
  { type: "vertical", label: "Vertical" },
]

export const DEFAULT_PATTERN_COLOR = "#ffffff"
export const DEFAULT_PATTERN_SCALE = 24
export const DEFAULT_PATTERN_OPACITY = 100

// Returns the inner markup of a single pattern tile (without the <pattern>
// wrapper), sized to `size`.
const tileContent = (
  type: CanvasPatternType,
  size: number,
  color: string,
): string => {
  const stroke = Math.max(1, Math.round(size / 16))
  switch (type) {
    case "dots":
      return `<circle cx="${size / 2}" cy="${size / 2}" r="${Math.max(1, size / 10)}" fill="${color}" />`
    case "grid":
      return `<path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="${stroke}" />`
    case "cross": {
      const c = size / 2
      const arm = size / 6
      return `<path d="M ${c - arm} ${c} L ${c + arm} ${c} M ${c} ${c - arm} L ${c} ${c + arm}" stroke="${color}" stroke-width="${stroke}" />`
    }
    case "diagonal":
      return `<path d="M 0 ${size} L ${size} 0 M -${size / 4} ${size / 4} L ${size / 4} -${size / 4} M ${(size * 3) / 4} ${(size * 5) / 4} L ${(size * 5) / 4} ${(size * 3) / 4}" stroke="${color}" stroke-width="${stroke}" />`
    case "horizontal":
      return `<path d="M 0 ${size / 2} L ${size} ${size / 2}" stroke="${color}" stroke-width="${stroke}" />`
    case "vertical":
      return `<path d="M ${size / 2} 0 L ${size / 2} ${size}" stroke="${color}" stroke-width="${stroke}" />`
    default:
      return ""
  }
}

// Builds a full, standalone SVG string that tiles the pattern across the given
// dimensions. Used both for the canvas render and the tab thumbnails.
export const buildPatternSvg = (
  type: CanvasPatternType,
  {
    width,
    height,
    size = DEFAULT_PATTERN_SCALE,
    color = DEFAULT_PATTERN_COLOR,
  }: { width: number; height: number; size?: number; color?: string },
): string => {
  const id = `pat-${type}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${tileContent(type, size, color)}</pattern></defs><rect width="${width}" height="${height}" fill="url(#${id})" /></svg>`
}

// Encodes an SVG string as a data URI usable in a CSS background-image.
export const patternToDataUri = (svg: string): string =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
