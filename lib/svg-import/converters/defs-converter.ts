import { ElementConverter } from "../registry"
import { ClipOrMaskDef } from "../types"

// defs itself just recurses so its gradient/clipPath/mask children register
// themselves into context.defs. It renders nothing.
export const DefsConverter: ElementConverter = {
  tagName: "defs",
  convert(node, context, registry) {
    registry.convertChildren(node.children, context)
    return null
  },
}

function makeClipOrMask(tagName: "clipPath" | "mask"): ElementConverter {
  return {
    tagName,
    convert(node, context, registry) {
      const id = node.attributes.id
      if (!id) return null
      const children = registry.convertChildren(node.children, context)
      const def: ClipOrMaskDef = { kind: tagName, id, children }
      context.defs.set(id, def)
      return null
    },
  }
}

export const ClipPathConverter = makeClipOrMask("clipPath")
export const MaskConverter = makeClipOrMask("mask")
