import { ElementConverter } from "../registry"
import { parseNumber } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

export const EllipseConverter: ElementConverter = {
  tagName: "ellipse",
  convert(node, context) {
    const base = baseSetup(node, context)
    const cx = parseNumber(node.attributes.cx, { fallback: 0 })
    const cy = parseNumber(node.attributes.cy, { fallback: 0 })
    const rx = parseNumber(node.attributes.rx, { fallback: 0 })
    const ry = parseNumber(node.attributes.ry, { fallback: 0 })

    const n = makeNode("ellipse", base, node, {
      x: base.translate.x + cx - rx,
      y: base.translate.y + cy - ry,
      width: rx * 2,
      height: ry * 2,
      data: { rx, ry },
    })
    if (rx === 0 || ry === 0) n.degenerate = true
    return n
  },
}
