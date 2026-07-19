import {
  ClipOrMaskDef,
  DefEntry,
  GradientDef,
  Point,
  SvgNode,
} from "./types"

// Serialize an (edited) SvgNode tree back into an SVG string for canvas render.
// The viewBox comes from the import result; defs (gradients/clip/mask) are
// re-emitted so url(#id) references still resolve.

export interface SerializeInput {
  root: SvgNode
  viewBox: { x: number; y: number; width: number; height: number } | null
  defs: Record<string, DefEntry>
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function styleAttrs(node: SvgNode): string {
  const s = node.style
  const parts: string[] = []
  if (s.fill != null) parts.push(`fill="${esc(s.fill)}"`)
  if (s.fillOpacity != null) parts.push(`fill-opacity="${s.fillOpacity}"`)
  if (s.stroke != null) parts.push(`stroke="${esc(s.stroke)}"`)
  if (s.strokeWidth != null) parts.push(`stroke-width="${s.strokeWidth}"`)
  if (s.strokeOpacity != null) parts.push(`stroke-opacity="${s.strokeOpacity}"`)
  if (s.strokeLinecap) parts.push(`stroke-linecap="${esc(s.strokeLinecap)}"`)
  if (s.strokeLinejoin) parts.push(`stroke-linejoin="${esc(s.strokeLinejoin)}"`)
  if (s.strokeDasharray) parts.push(`stroke-dasharray="${esc(s.strokeDasharray)}"`)
  if (node.opacity != null && node.opacity < 1) parts.push(`opacity="${node.opacity}"`)
  return parts.join(" ")
}

function pointsAttr(points: Point[] | undefined): string {
  if (!points) return ""
  return points.map((p) => `${p.x},${p.y}`).join(" ")
}

function transformAttr(node: SvgNode): string {
  if (node.transformMatrix) {
    const [a, b, c, d, e, f] = node.transformMatrix
    return `transform="matrix(${a} ${b} ${c} ${d} ${e} ${f})"`
  }
  return ""
}

function serializeNode(node: SvgNode): string {
  if (node.visible === false) return ""
  const style = styleAttrs(node)
  const transform = transformAttr(node)
  const common = [style, transform].filter(Boolean).join(" ")

  switch (node.type) {
    case "group":
      return `<g ${common}>${(node.children ?? []).map(serializeNode).join("")}</g>`
    case "rect":
      return `<rect x="${node.x}" y="${node.y}" width="${node.width ?? 0}" height="${
        node.height ?? 0
      }" ${node.data?.rectRx != null ? `rx="${node.data.rectRx}"` : ""} ${common} />`
    case "circle":
      return `<circle cx="${node.x + (node.data?.radius ?? 0)}" cy="${
        node.y + (node.data?.radius ?? 0)
      }" r="${node.data?.radius ?? 0}" ${common} />`
    case "ellipse":
      return `<ellipse cx="${node.x + (node.data?.rx ?? 0)}" cy="${
        node.y + (node.data?.ry ?? 0)
      }" rx="${node.data?.rx ?? 0}" ry="${node.data?.ry ?? 0}" ${common} />`
    case "line":
      return `<line x1="${node.data?.x1 ?? 0}" y1="${node.data?.y1 ?? 0}" x2="${
        node.data?.x2 ?? 0
      }" y2="${node.data?.y2 ?? 0}" ${common} />`
    case "polyline":
      return `<polyline points="${pointsAttr(node.data?.points)}" ${common} />`
    case "polygon":
      return `<polygon points="${pointsAttr(node.data?.points)}" ${common} />`
    case "path":
      return `<path d="${esc(node.data?.path ?? "")}" ${common} />`
    case "text":
      return `<text x="${node.x}" y="${node.y}" ${
        node.data?.fontFamily ? `font-family="${esc(String(node.data.fontFamily))}"` : ""
      } ${node.data?.fontSize ? `font-size="${node.data.fontSize}"` : ""} ${
        node.data?.textAnchor ? `text-anchor="${node.data.textAnchor}"` : ""
      } ${common}>${esc(node.data?.text ?? "")}</text>`
    case "image":
      return `<image href="${esc(node.data?.imageUrl ?? "")}" x="${node.x}" y="${
        node.y
      }" width="${node.width ?? 0}" height="${node.height ?? 0}" ${transform} />`
    default:
      return ""
  }
}

function serializeGradient(g: GradientDef): string {
  const stops = g.stops
    .map(
      (s) =>
        `<stop offset="${s.offset}" stop-color="${esc(s.color)}" stop-opacity="${s.opacity}" />`,
    )
    .join("")
  const coords = Object.entries(g.coords)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ")
  const gt = g.gradientTransform
    ? `gradientTransform="matrix(${g.gradientTransform.join(" ")})"`
    : ""
  const units = g.gradientUnits ? `gradientUnits="${esc(g.gradientUnits)}"` : ""
  return `<${g.kind} id="${esc(g.id)}" ${coords} ${gt} ${units}>${stops}</${g.kind}>`
}

function serializeClipOrMask(def: ClipOrMaskDef): string {
  const inner = def.children.map(serializeNode).join("")
  return `<${def.kind} id="${esc(def.id)}">${inner}</${def.kind}>`
}

function serializeDefs(defs: Record<string, DefEntry>): string {
  const entries = Object.values(defs)
  if (entries.length === 0) return ""
  const body = entries
    .map((d) =>
      d.kind === "linearGradient" || d.kind === "radialGradient"
        ? serializeGradient(d)
        : serializeClipOrMask(d as ClipOrMaskDef),
    )
    .join("")
  return `<defs>${body}</defs>`
}

export function serializeToSvg(input: SerializeInput): string {
  const vb = input.viewBox ?? { x: 0, y: 0, width: 300, height: 150 }
  const defs = serializeDefs(input.defs)
  // The root is a synthetic group; emit its children directly under <svg>.
  const body = (input.root.children ?? []).map(serializeNode).join("")
  return `<svg viewBox="${vb.x} ${vb.y} ${vb.width} ${vb.height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:100%">${defs}${body}</svg>`
}
