import { ElementConverter } from "../registry"
import { SvgsonNode } from "../types"
import { parseNumber } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

// Concatenate text from direct text nodes and nested <tspan>.
function collectText(node: SvgsonNode): string {
  let out = ""
  for (const child of node.children) {
    if (child.type === "text") out += child.value ?? ""
    else if (child.name === "tspan") out += collectText(child)
  }
  return out
}

export const TextConverter: ElementConverter = {
  tagName: "text",
  convert(node, context) {
    const base = baseSetup(node, context)
    // x/y may be lists; take the first.
    const x = parseNumber((node.attributes.x ?? "0").split(/[\s,]+/)[0], { fallback: 0 })
    const y = parseNumber((node.attributes.y ?? "0").split(/[\s,]+/)[0], { fallback: 0 })
    const fontSize = node.attributes["font-size"] ?? node.attributes.fontSize
    const fontFamily = node.attributes["font-family"] ?? node.attributes.fontFamily
    const fontWeight = node.attributes["font-weight"] ?? node.attributes.fontWeight
    const anchor = (node.attributes["text-anchor"] ?? node.attributes.textAnchor) as
      | "start"
      | "middle"
      | "end"
      | undefined

    const text = collectText(node)

    return makeNode("text", base, node, {
      x: base.translate.x + x,
      y: base.translate.y + y,
      data: {
        text,
        fontFamily,
        fontSize: fontSize != null ? parseNumber(fontSize, { fallback: 16 }) : undefined,
        fontWeight,
        textAnchor: anchor ?? "start",
      },
    })
  },
}
