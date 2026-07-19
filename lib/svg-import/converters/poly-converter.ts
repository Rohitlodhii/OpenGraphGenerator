import { ElementConverter } from "../registry"
import { Point } from "../types"
import { parseNumberList } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

export function parsePoints(value: string | undefined): Point[] {
  const nums = parseNumberList(value)
  const pts: Point[] = []
  for (let i = 0; i + 1 < nums.length; i += 2) {
    pts.push({ x: nums[i], y: nums[i + 1] })
  }
  return pts
}

function bounds(points: Point[]) {
  if (points.length === 0) return { minX: 0, minY: 0, width: 0, height: 0 }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of points) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }
  return { minX, minY, width: maxX - minX, height: maxY - minY }
}

export const PolylineConverter: ElementConverter = {
  tagName: "polyline",
  convert(node, context) {
    const base = baseSetup(node, context)
    const points = parsePoints(node.attributes.points)
    const b = bounds(points)
    return makeNode("polyline", base, node, {
      x: base.translate.x + b.minX,
      y: base.translate.y + b.minY,
      width: b.width,
      height: b.height,
      data: { points },
    })
  },
}

export const PolygonConverter: ElementConverter = {
  tagName: "polygon",
  convert(node, context) {
    const base = baseSetup(node, context)
    const points = parsePoints(node.attributes.points)
    const b = bounds(points)
    return makeNode("polygon", base, node, {
      x: base.translate.x + b.minX,
      y: base.translate.y + b.minY,
      width: b.width,
      height: b.height,
      data: { points },
    })
  },
}
