import { ImportContext } from "./context"
import { SvgNode, SvgsonNode } from "./types"

export interface ElementConverter {
  tagName: string
  convert(
    node: SvgsonNode,
    context: ImportContext,
    registry: ImporterRegistry,
  ): SvgNode | SvgNode[] | null
}

export class ImporterRegistry {
  private converters = new Map<string, ElementConverter>()

  register(converter: ElementConverter): void {
    this.converters.set(converter.tagName.toLowerCase(), converter)
  }

  has(tagName: string): boolean {
    return this.converters.has(tagName.toLowerCase())
  }

  // Convert a node; returns null for unsupported (with a dev warning).
  convert(
    node: SvgsonNode,
    context: ImportContext,
  ): SvgNode | SvgNode[] | null {
    const converter = this.converters.get(node.name.toLowerCase())
    if (!converter) {
      context.unsupportedElements.add(node.name)
      if (!context.options.ignoreUnsupported) {
        context.warnings.warn(
          "UNSUPPORTED_ELEMENT",
          `No converter registered for <${node.name}>`,
          node.name,
        )
      }
      return null
    }
    context.elementCount += 1
    return converter.convert(node, context, this)
  }

  // Convert a list of children, flattening arrays and dropping nulls.
  convertChildren(children: SvgsonNode[], context: ImportContext): SvgNode[] {
    const out: SvgNode[] = []
    for (const child of children) {
      if (child.type === "text" || child.name === "") continue
      const result = this.convert(child, context)
      if (result == null) continue
      if (Array.isArray(result)) out.push(...result)
      else out.push(result)
    }
    return out
  }
}
