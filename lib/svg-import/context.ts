import { Matrix } from "./transform"
import { identityMatrix } from "./transform"
import { DefEntry, ImportOptions, ResolvedStyle, SvgsonNode } from "./types"
import { WarningCollector } from "./utils/warnings"
import { ViewBox } from "./utils/viewbox-parser"

export interface ImportContext {
  parentStyle: ResolvedStyle
  parentTransform: Matrix
  defs: Map<string, DefEntry>
  // Map of id → raw AST node, for resolving <use href="#id">.
  idMap: Map<string, SvgsonNode>
  viewBox: ViewBox | null
  options: Required<Pick<ImportOptions, "flattenGroups" | "preserveIds" | "ignoreUnsupported">>
  warnings: WarningCollector
  // Cycle detection for <use>.
  useStack: Set<string>
  // Mutable stats.
  elementCount: number
  unsupportedElements: Set<string>
}

const DEFAULT_STYLE: ResolvedStyle = {
  fill: "#000000",
  color: "#000000",
}

export function buildImportContext(options: ImportOptions = {}): ImportContext {
  return {
    parentStyle: { ...DEFAULT_STYLE },
    parentTransform: identityMatrix(),
    defs: new Map(),
    idMap: new Map(),
    viewBox: null,
    options: {
      flattenGroups: options.flattenGroups ?? false,
      preserveIds: options.preserveIds ?? true,
      ignoreUnsupported: options.ignoreUnsupported ?? true,
    },
    warnings: new WarningCollector(options.onWarning),
    useStack: new Set(),
    elementCount: 0,
    unsupportedElements: new Set(),
  }
}

// Produce a child context that inherits style + transform, sharing the same
// defs/warnings/stats (single-pass, no re-walk).
export function childContext(
  parent: ImportContext,
  overrides: Partial<Pick<ImportContext, "parentStyle" | "parentTransform">>,
): ImportContext {
  return {
    ...parent,
    parentStyle: overrides.parentStyle ?? parent.parentStyle,
    parentTransform: overrides.parentTransform ?? parent.parentTransform,
  }
}

// Walk the AST once and index every node that carries an id, so <use> can
// resolve references without re-walking.
export function indexIds(node: SvgsonNode, idMap: Map<string, SvgsonNode>): void {
  const id = node.attributes?.id
  if (id && !idMap.has(id)) idMap.set(id, node)
  for (const child of node.children ?? []) indexIds(child, idMap)
}
