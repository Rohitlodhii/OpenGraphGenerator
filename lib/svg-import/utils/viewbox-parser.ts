import { parseNumberList } from "./number-parser"

export interface ViewBox {
  x: number
  y: number
  width: number
  height: number
}

// Per SVG spec, the default when no viewBox and no width/height is given.
export const DEFAULT_VIEWBOX: ViewBox = { x: 0, y: 0, width: 300, height: 150 }

export function parseViewBox(value: string | undefined | null): ViewBox | null {
  if (!value) return null
  const parts = parseNumberList(value)
  if (parts.length !== 4) return null
  const [x, y, width, height] = parts
  if (width <= 0 || height <= 0) return null
  return { x, y, width, height }
}
