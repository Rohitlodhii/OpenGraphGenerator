import { ElementConverter } from "../registry"
import { parseNumber } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

export const CircleConverter: ElementConverter = {
  tagName: "circle",
  convert(node, context) {
    const base = baseSetup(node, context)
    const cx = parseNumber(node.attributes.cx, { fallback: 0 })
    const cy = parseNumber(node.attributes.cy, { fallback: 0 })
    const r = parseNumber(node.attributes.r, { fallback: 0 })

    const n = makeNode("circle", base, node, {
      // Store top-left origin for consistency with the box model.
      x: base.translate.x + cx - r,
      y: base.translate.y + cy - r,
      width: r * 2,
      height: r * 2,
      data: { radius: r },
    })
    if (r === 0) n.degenerate = true
    return n
  },
}
