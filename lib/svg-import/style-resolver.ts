import { ResolvedStyle, SvgsonNode } from "./types"
import { parseColor } from "./utils/color-parser"
import { parseNumber } from "./utils/number-parser"

// Presentation attributes we resolve into the style object.
const STYLE_PROPS = [
  "fill",
  "fill-opacity",
  "stroke",
  "stroke-width",
  "stroke-opacity",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "opacity",
  "color",
] as const

type StyleKey = (typeof STYLE_PROPS)[number]

// Parse a `style="a:b;c:d"` string into a flat map.
function parseInlineStyle(style: string | undefined): Partial<Record<string, string>> {
  const out: Record<string, string> = {}
  if (!style) return out
  for (const decl of style.split(";")) {
    const idx = decl.indexOf(":")
    if (idx === -1) continue
    const key = decl.slice(0, idx).trim().toLowerCase()
    const value = decl.slice(idx + 1).trim()
    if (key) out[key] = value
  }
  return out
}

// Collect the raw string value for a style prop, honoring priority:
// style="" attribute  >  presentation attribute. (Both beat inheritance, and
// per CSS the style attribute wins over the presentation attribute.)
function rawValue(
  node: SvgsonNode,
  inlineStyle: Partial<Record<string, string>>,
  prop: StyleKey,
): string | undefined {
  return inlineStyle[prop] ?? node.attributes[prop] ?? node.attributes[camel(prop)]
}

// svgson camelcase:true converts `stroke-width` → `strokeWidth`; support both.
function camel(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

export interface ResolveResult {
  style: ResolvedStyle
  // Combined element opacity = opacity * (fill/stroke handled at render).
  opacity: number
}

export function resolveStyle(
  node: SvgsonNode,
  parent: ResolvedStyle,
): ResolveResult {
  const inline = parseInlineStyle(node.attributes.style)
  const style: ResolvedStyle = { ...parent }

  const currentColor = rawValue(node, inline, "color") ?? parent.color ?? "#000000"
  const colorParsed = parseColor(currentColor, { currentColor: parent.color })
  if (colorParsed && !colorParsed.isReference) style.color = colorParsed.value

  // fill / stroke
  for (const prop of ["fill", "stroke"] as const) {
    const raw = rawValue(node, inline, prop)
    if (raw == null) continue
    if (raw.trim().toLowerCase() === "inherit") continue // keep parent
    const parsed = parseColor(raw, { currentColor: style.color })
    if (parsed) style[prop] = parsed.value
  }

  // numeric / string props
  const numAssign = (prop: StyleKey, key: keyof ResolvedStyle) => {
    const raw = rawValue(node, inline, prop)
    if (raw == null || raw.toLowerCase() === "inherit") return
    ;(style[key] as number) = parseNumber(raw, { fallback: 0 })
  }
  const strAssign = (prop: StyleKey, key: keyof ResolvedStyle) => {
    const raw = rawValue(node, inline, prop)
    if (raw == null || raw.toLowerCase() === "inherit") return
    ;(style[key] as string) = raw.trim()
  }

  numAssign("fill-opacity", "fillOpacity")
  numAssign("stroke-opacity", "strokeOpacity")
  numAssign("stroke-width", "strokeWidth")
  strAssign("stroke-linecap", "strokeLinecap")
  strAssign("stroke-linejoin", "strokeLinejoin")
  strAssign("stroke-dasharray", "strokeDasharray")

  // Element opacity (not inherited multiplicatively into style, but into the
  // node's own opacity — parent opacity is combined by the converter).
  const opacityRaw = rawValue(node, inline, "opacity")
  const opacity = opacityRaw != null ? clamp01(parseNumber(opacityRaw, { fallback: 1 })) : 1

  return { style, opacity }
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}
