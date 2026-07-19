import { parseSync } from "svgson"
import { buildImportContext, indexIds } from "./context"
import { registerDefaultConverters } from "./converters"
import { ImporterRegistry } from "./registry"
import { DefEntry, ImportOptions, ImportResult, SvgNode, SvgsonNode } from "./types"

export type {
  SvgNode,
  SvgNodeType,
  SvgNodeData,
  ImportResult,
  ImportOptions,
  ImportWarning,
  ResolvedStyle,
  DefEntry,
  GradientDef,
  Point,
} from "./types"
export { serializeToSvg } from "./serialize"
export type { SerializeInput } from "./serialize"

// Collect the leaf (drawable) nodes of a tree — the "parts" the editor exposes.
export function collectLeafParts(root: SvgNode): SvgNode[] {
  const out: SvgNode[] = []
  const walk = (node: SvgNode) => {
    if (node.type === "group") {
      for (const child of node.children ?? []) walk(child)
    } else {
      out.push(node)
    }
  }
  walk(root)
  return out
}

// Find a node by id anywhere in the tree (for editing a specific part).
export function findNodeById(root: SvgNode, id: string): SvgNode | null {
  if (root.id === id) return root
  for (const child of root.children ?? []) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}

// ---- Color grouping (dedup identical colors across parts) ----

export type ColorProperty = "fill" | "stroke"

export interface ColorUsage {
  partId: string
  property: ColorProperty
}

export interface ColorGroup {
  // Normalized hex value shared by every usage in this group.
  color: string
  usages: ColorUsage[]
}

// Only plain hex fills/strokes are groupable; `none` and url(#id) gradient
// references are left alone (not editable as flat colors).
function isEditableColor(value: string | undefined): value is string {
  return value != null && /^#[0-9a-fA-F]{6,8}$/.test(value)
}

// Collapse identical colors across all leaf parts into one group each, so the
// editor can expose a single control per unique color. A fill and a stroke that
// share the same hex land in the SAME group, and editing it updates every
// matching part at once. Groups are ordered by first appearance in tree order.
export function collectColorGroups(root: SvgNode): ColorGroup[] {
  const groups = new Map<string, ColorGroup>()
  const record = (color: string, usage: ColorUsage) => {
    const key = color.toLowerCase()
    const existing = groups.get(key)
    if (existing) existing.usages.push(usage)
    else groups.set(key, { color: key, usages: [usage] })
  }
  for (const part of collectLeafParts(root)) {
    if (isEditableColor(part.style.fill)) {
      record(part.style.fill, { partId: part.id, property: "fill" })
    }
    if (isEditableColor(part.style.stroke)) {
      record(part.style.stroke, { partId: part.id, property: "stroke" })
    }
  }
  return [...groups.values()]
}

// Clone the tree and rewrite every fill/stroke matching `oldColor` to
// `newColor`. Comparison is case-insensitive against the normalized hex.
export function applyColorToTree(
  root: SvgNode,
  oldColor: string,
  newColor: string,
): SvgNode {
  const target = oldColor.toLowerCase()
  const cloned = structuredClone(root)
  const walk = (node: SvgNode) => {
    if (node.style.fill?.toLowerCase() === target) node.style.fill = newColor
    if (node.style.stroke?.toLowerCase() === target) node.style.stroke = newColor
    for (const child of node.children ?? []) walk(child)
  }
  walk(cloned)
  return cloned
}

export function importSVG(
  svgString: string,
  options: ImportOptions = {},
): ImportResult {
  const startTime =
    typeof performance !== "undefined" ? performance.now() : 0

  let ast: SvgsonNode
  try {
    ast = parseSync(svgString, { camelcase: false }) as unknown as SvgsonNode
  } catch (error) {
    return {
      success: false,
      root: null,
      viewBox: null,
      defs: {},
      warnings: [],
      stats: { elementCount: 0, unsupportedElements: [], parseTimeMs: 0 },
      error: error instanceof Error ? error.message : "Parse failed",
    }
  }

  if (!ast || ast.name !== "svg") {
    return {
      success: false,
      root: null,
      viewBox: null,
      defs: {},
      warnings: [],
      stats: { elementCount: 0, unsupportedElements: [], parseTimeMs: 0 },
      error: "Root element is not <svg>",
    }
  }

  const context = buildImportContext(options)
  indexIds(ast, context.idMap)

  const registry = new ImporterRegistry()
  registerDefaultConverters(registry)

  const converted = registry.convert(ast, context)
  const root = Array.isArray(converted) ? converted[0] ?? null : converted

  const defs: Record<string, DefEntry> = {}
  for (const [id, entry] of context.defs) defs[id] = entry

  const parseTimeMs =
    typeof performance !== "undefined" ? performance.now() - startTime : 0

  return {
    success: root !== null,
    root,
    viewBox: context.viewBox,
    defs,
    warnings: context.warnings.getAll(),
    stats: {
      elementCount: context.elementCount,
      unsupportedElements: [...context.unsupportedElements],
      parseTimeMs,
    },
  }
}
