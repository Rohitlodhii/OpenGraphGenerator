import { ElementConverter } from "../registry"
import { parseNumber } from "../utils/number-parser"
import { baseSetup, makeNode } from "./base"

export const ImageConverter: ElementConverter = {
  tagName: "image",
  convert(node, context) {
    const base = baseSetup(node, context)
    const href =
      node.attributes.href ??
      node.attributes["xlink:href"] ??
      node.attributes.xlinkHref ??
      ""
    const x = parseNumber(node.attributes.x, { fallback: 0 })
    const y = parseNumber(node.attributes.y, { fallback: 0 })
    const width = node.attributes.width != null ? parseNumber(node.attributes.width) : 0
    const height = node.attributes.height != null ? parseNumber(node.attributes.height) : 0

    if (!href) {
      context.warnings.warn("IMAGE_NO_HREF", "image has no href", "image")
    }

    const n = makeNode("image", base, node, {
      x: base.translate.x + x,
      y: base.translate.y + y,
      width,
      height,
      data: { imageUrl: href, imageWidth: width, imageHeight: height },
    })
    if (width === 0 || height === 0) n.degenerate = true
    return n
  },
}
