import { ElementConverter } from "../registry"
import { parseNumber } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

export const LineConverter: ElementConverter = {
  tagName: "line",
  convert(node, context) {
    const base = baseSetup(node, context)
    const x1 = parseNumber(node.attributes.x1, { fallback: 0 })
    const y1 = parseNumber(node.attributes.y1, { fallback: 0 })
    const x2 = parseNumber(node.attributes.x2, { fallback: 0 })
    const y2 = parseNumber(node.attributes.y2, { fallback: 0 })

    const minX = Math.min(x1, x2)
    const minY = Math.min(y1, y2)

    return makeNode("line", base, node, {
      x: base.translate.x + minX,
      y: base.translate.y + minY,
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      data: { x1, y1, x2, y2 },
    })
  },
}
