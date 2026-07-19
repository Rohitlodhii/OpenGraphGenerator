import { ElementConverter } from "../registry"
import { GradientDef, GradientStop, SvgsonNode } from "../types"
import { parseColor } from "../utils/color-parser"
import { parseNumber } from "../utils/number-parser"
import { parseTransform, toMatrix6 } from "../transform"

function parseStops(node: SvgsonNode): GradientStop[] {
  const stops: GradientStop[] = []
  for (const child of node.children) {
    if (child.name !== "stop") continue
    const offsetRaw = child.attributes.offset ?? "0"
    const offset = offsetRaw.endsWith("%")
      ? parseNumber(offsetRaw) / 100
      : parseNumber(offsetRaw)
    const style = child.attributes.style ?? ""
    const styleColor = style.match(/stop-color:\s*([^;]+)/i)?.[1]
    const styleOpacity = style.match(/stop-opacity:\s*([^;]+)/i)?.[1]
    const colorRaw = child.attributes["stop-color"] ?? child.attributes.stopColor ?? styleColor
    const parsed = colorRaw ? parseColor(colorRaw) : null
    const opacityRaw =
      child.attributes["stop-opacity"] ?? child.attributes.stopOpacity ?? styleOpacity
    stops.push({
      offset,
      color: parsed && !parsed.isReference ? parsed.value : "#000000",
      opacity: opacityRaw != null ? parseNumber(opacityRaw, { fallback: 1 }) : 1,
    })
  }
  return stops
}

function makeGradientConverter(
  tagName: "linearGradient" | "radialGradient",
): ElementConverter {
  return {
    tagName,
    convert(node, context) {
      const id = node.attributes.id
      if (!id) return null

      const coordKeys =
        tagName === "linearGradient"
          ? ["x1", "y1", "x2", "y2"]
          : ["cx", "cy", "r", "fx", "fy"]
      const coords: Record<string, string> = {}
      for (const k of coordKeys) {
        if (node.attributes[k] != null) coords[k] = node.attributes[k]
      }

      const gradientTransform = node.attributes.gradientTransform
        ? toMatrix6(parseTransform(node.attributes.gradientTransform))
        : undefined

      const def: GradientDef = {
        kind: tagName,
        id,
        stops: parseStops(node),
        gradientTransform,
        coords,
        gradientUnits: node.attributes.gradientUnits,
        href: node.attributes.href ?? node.attributes["xlink:href"],
      }
      context.defs.set(id, def)
      return null // defs are not rendered directly
    },
  }
}

export const LinearGradientConverter = makeGradientConverter("linearGradient")
export const RadialGradientConverter = makeGradientConverter("radialGradient")
