import { childContext } from "../context"
import { ElementConverter } from "../registry"
import { composeMatrix, parseTransform, translate } from "../transform"
import { resolveStyle } from "../style-resolver"
import { parseNumber } from "../utils/number-parser"

export const UseConverter: ElementConverter = {
  tagName: "use",
  convert(node, context, registry) {
    const href = node.attributes.href ?? node.attributes["xlink:href"] ?? ""
    const id = href.startsWith("#") ? href.slice(1) : href
    if (!id) return null

    if (context.useStack.has(id)) {
      context.warnings.warn("USE_CYCLE", `Circular <use> reference to #${id}`, "use")
      return null
    }

    const target = context.idMap.get(id)
    if (!target) {
      context.warnings.warn("USE_UNRESOLVED", `<use> target #${id} not found`, "use")
      return null
    }

    const x = parseNumber(node.attributes.x, { fallback: 0 })
    const y = parseNumber(node.attributes.y, { fallback: 0 })
    const { style } = resolveStyle(node, context.parentStyle)
    const matrix = composeMatrix(
      context.parentTransform,
      parseTransform(node.attributes.transform),
      translate(x, y),
    )

    context.useStack.add(id)
    const child = childContext(context, { parentStyle: style, parentTransform: matrix })
    const result = registry.convert(target, child)
    context.useStack.delete(id)
    return result
  },
}
