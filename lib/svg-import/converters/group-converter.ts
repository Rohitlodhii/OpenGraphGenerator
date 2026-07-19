import { childContext } from "../context"
import { ElementConverter } from "../registry"
import { resolveStyle } from "../style-resolver"
import { composeMatrix, decompose, parseTransform, toMatrix6 } from "../transform"
import { SvgNode } from "../types"
import { generateId } from "../utils/id-generator"
import { refId } from "./base"

export const GroupConverter: ElementConverter = {
  tagName: "g",
  convert(node, context, registry) {
    const { style } = resolveStyle(node, context.parentStyle)
    const localMatrix = parseTransform(node.attributes.transform)
    const matrix = composeMatrix(context.parentTransform, localMatrix)

    const child = childContext(context, {
      parentStyle: style,
      parentTransform: matrix,
    })
    const children = registry.convertChildren(node.children, child)

    // Optionally flatten a group that carries no meaningful transform/clip.
    if (
      context.options.flattenGroups &&
      children.length === 1 &&
      !node.attributes["clip-path"] &&
      !node.attributes.mask
    ) {
      return children[0]
    }

    const d = decompose(matrix)
    const group: SvgNode = {
      id: generateId(),
      type: "group",
      name: node.attributes.id ?? node.attributes.class,
      x: d.tx,
      y: d.ty,
      rotation: d.rotation,
      scaleX: d.scaleX,
      scaleY: d.scaleY,
      visible: true,
      opacity: resolveStyle(node, context.parentStyle).opacity,
      style,
      transformMatrix: d.hasComplexTransform ? toMatrix6(matrix) : undefined,
      hasComplexTransform: d.hasComplexTransform || undefined,
      clipPathRef: refId(node.attributes["clip-path"] ?? node.attributes.clipPath),
      maskRef: refId(node.attributes.mask),
      children,
      svgSource: { elementName: "g", originalAttributes: node.attributes },
    }
    return group
  },
}
