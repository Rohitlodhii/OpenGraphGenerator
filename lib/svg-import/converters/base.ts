import { ImportContext } from "../context"
import { resolveStyle } from "../style-resolver"
import { composeMatrix, decompose, parseTransform, toMatrix6 } from "../transform"
import { SvgNode, SvgNodeType, SvgsonNode } from "../types"
import { generateId } from "../utils/id-generator"

// Shared setup for leaf/shape converters: resolves style, composes and
// decomposes the transform, applies element opacity, wires metadata.
export interface BaseSetup {
  id: string
  name?: string
  style: SvgNode["style"]
  opacity: number
  rotation: number
  scaleX: number
  scaleY: number
  translate: { x: number; y: number }
  transformMatrix?: SvgNode["transformMatrix"]
  hasComplexTransform?: boolean
}

export function baseSetup(node: SvgsonNode, context: ImportContext): BaseSetup {
  const { style, opacity } = resolveStyle(node, context.parentStyle)

  const localMatrix = parseTransform(node.attributes.transform)
  const matrix = composeMatrix(context.parentTransform, localMatrix)
  const d = decompose(matrix)

  const preserveIds = context.options.preserveIds
  const name =
    (preserveIds ? node.attributes.id : undefined) ??
    node.attributes.id ??
    node.attributes.class ??
    undefined

  return {
    id: generateId(),
    name,
    style,
    opacity,
    rotation: d.rotation,
    scaleX: d.scaleX,
    scaleY: d.scaleY,
    translate: { x: d.tx, y: d.ty },
    transformMatrix: d.hasComplexTransform ? toMatrix6(matrix) : undefined,
    hasComplexTransform: d.hasComplexTransform || undefined,
  }
}

// Build a SvgNode from base setup + type-specific spatial/data fields.
export function makeNode(
  type: SvgNodeType,
  base: BaseSetup,
  node: SvgsonNode,
  extra: Partial<SvgNode>,
): SvgNode {
  const clipRef = refId(node.attributes["clip-path"] ?? node.attributes.clipPath)
  const maskRef = refId(node.attributes.mask)

  return {
    id: base.id,
    type,
    name: base.name,
    x: extra.x ?? base.translate.x,
    y: extra.y ?? base.translate.y,
    width: extra.width,
    height: extra.height,
    rotation: base.rotation,
    scaleX: base.scaleX,
    scaleY: base.scaleY,
    visible: true,
    opacity: base.opacity,
    style: base.style,
    data: extra.data,
    transformMatrix: base.transformMatrix,
    hasComplexTransform: base.hasComplexTransform,
    clipPathRef: clipRef,
    maskRef: maskRef,
    children: extra.children,
    svgSource: {
      elementName: node.name,
      originalAttributes: node.attributes,
    },
  }
}

// Extract the id from a `url(#id)` reference attribute.
export function refId(value: string | undefined): string | undefined {
  if (!value) return undefined
  const m = value.match(/url\((['"]?)(#[^'")]+)\1\)/i)
  if (m) return m[2].slice(1)
  if (value.startsWith("#")) return value.slice(1)
  return undefined
}
