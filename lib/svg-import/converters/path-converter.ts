import { ElementConverter } from "../registry"
import { PathCommand, Point } from "../types"
import { normalizePath } from "../utils/path-normalizer"
import { baseSetup, makeNode } from "./base"

// Approximate bounds from command endpoints + control points (good enough for
// the box model; exact bezier bounds aren't needed for editing).
function pathBounds(commands: PathCommand[]) {
  const pts: Point[] = []
  for (const c of commands) {
    const cc = c as PathCommand & {
      end?: Point
      cp?: Point
      cp1?: Point
      cp2?: Point
      value?: number
      code: string
    }
    if (cc.end) pts.push(cc.end)
    if (cc.cp) pts.push(cc.cp)
    if (cc.cp1) pts.push(cc.cp1)
    if (cc.cp2) pts.push(cc.cp2)
  }
  if (pts.length === 0) return { minX: 0, minY: 0, width: 0, height: 0 }
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of pts) {
    minX = Math.min(minX, p.x)
    minY = Math.min(minY, p.y)
    maxX = Math.max(maxX, p.x)
    maxY = Math.max(maxY, p.y)
  }
  return { minX, minY, width: maxX - minX, height: maxY - minY }
}

export const PathConverter: ElementConverter = {
  tagName: "path",
  convert(node, context) {
    const base = baseSetup(node, context)
    const d = node.attributes.d ?? ""
    if (!d.trim()) {
      context.warnings.warn("EMPTY_PATH", "path has no d attribute", "path")
    }
    const { commands, absoluteD } = normalizePath(d)
    const b = pathBounds(commands)

    return makeNode("path", base, node, {
      x: base.translate.x + b.minX,
      y: base.translate.y + b.minY,
      width: b.width,
      height: b.height,
      data: { path: absoluteD || d, pathCommands: commands },
    })
  },
}
