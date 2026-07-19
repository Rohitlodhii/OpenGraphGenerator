import { childContext } from "../context"
import { ElementConverter } from "../registry"
import { resolveStyle } from "../style-resolver"
import { SvgNode, SvgsonNode } from "../types"
import { generateId } from "../utils/id-generator"
import { parseNumber } from "../utils/number-parser"
import { DEFAULT_VIEWBOX, parseViewBox } from "../utils/viewbox-parser"
import { composeMatrix, translate } from "../transform"

// Order children so <defs> (and any gradient/clipPath/mask) are converted
// before the elements that reference them.
function defsFirst(children: SvgsonNode[]): SvgsonNode[] {
  const defs: SvgsonNode[] = []
  const rest: SvgsonNode[] = []
  const isDef = (n: SvgsonNode) =>
    ["defs", "lineargradient", "radialgradient", "clippath", "mask", "symbol"].includes(
      n.name.toLowerCase(),
    )
  for (const c of children) (isDef(c) ? defs : rest).push(c)
  return [...defs, ...rest]
}

export const SvgConverter: ElementConverter = {
  tagName: "svg",
  convert(node, context, registry) {
    const viewBox = parseViewBox(node.attributes.viewBox)
    const width = node.attributes.width != null ? parseNumber(node.attributes.width) : undefined
    const height = node.attributes.height != null ? parseNumber(node.attributes.height) : undefined

    const resolved =
      viewBox ??
      (width && height ? { x: 0, y: 0, width, height } : DEFAULT_VIEWBOX)
    context.viewBox = resolved

    const { style } = resolveStyle(node, context.parentStyle)

    // A non-zero viewBox origin shifts all children.
    let transform = context.parentTransform
    if (resolved.x !== 0 || resolved.y !== 0) {
      transform = composeMatrix(transform, translate(-resolved.x, -resolved.y))
    }

    const child = childContext(context, { parentStyle: style, parentTransform: transform })
    const children = registry.convertChildren(defsFirst(node.children), child)

    const root: SvgNode = {
      id: generateId(),
      type: "group",
      name: node.attributes.id ?? "svg-root",
      x: 0,
      y: 0,
      width: resolved.width,
      height: resolved.height,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      visible: true,
      opacity: 1,
      style,
      children,
      svgSource: { elementName: "svg", originalAttributes: node.attributes },
    }
    return root
  },
}
