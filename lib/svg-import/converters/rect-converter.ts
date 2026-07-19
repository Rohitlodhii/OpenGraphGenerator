import { ElementConverter } from "../registry"
import { parseNumber } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

export const RectConverter: ElementConverter = {
  tagName: "rect",
  convert(node, context) {
    const base = baseSetup(node, context)
    const x = parseNumber(node.attributes.x, { fallback: 0 })
    const y = parseNumber(node.attributes.y, { fallback: 0 })
    let width = parseNumber(node.attributes.width, { fallback: 0 })
    let height = parseNumber(node.attributes.height, { fallback: 0 })
    const rx = node.attributes.rx != null ? parseNumber(node.attributes.rx) : undefined
    const ry = node.attributes.ry != null ? parseNumber(node.attributes.ry) : undefined

    let degenerate = false
    if (width < 0) {
      context.warnings.warn("NEGATIVE_SIZE", "rect width < 0, using abs()", "rect")
      width = Math.abs(width)
    }
    if (height < 0) {
      context.warnings.warn("NEGATIVE_SIZE", "rect height < 0, using abs()", "rect")
      height = Math.abs(height)
    }
    if (width === 0 || height === 0) degenerate = true

    const n = makeNode("rect", base, node, {
      x: base.translate.x + x,
      y: base.translate.y + y,
      width,
      height,
      data: { rectRx: rx, rectRy: ry },
    })
    if (degenerate) n.degenerate = true
    return n
  },
}
