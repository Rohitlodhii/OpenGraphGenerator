"use client"

import React from "react"
import { CanvasObject } from "@/store/canvasstore"
import { serializeToSvg } from "@/lib/svg-import"

type Props = {
  object: CanvasObject
  style?: React.CSSProperties
}

// Renders an imported-and-edited SVG by serializing its object model back to an
// SVG string. Falls back to an empty box if the tree is missing.
const ImportedSvgPreviewer: React.FC<Props> = ({ object, style }) => {
  const html = React.useMemo(() => {
    if (!object.svgTree) return null
    try {
      return serializeToSvg({
        root: object.svgTree,
        viewBox: object.svgViewBox ?? null,
        defs: object.svgDefs ?? {},
      })
    } catch {
      return null
    }
  }, [object.svgTree, object.svgViewBox, object.svgDefs])

  return (
    <div
      style={{
        ...style,
        width: object.width ?? 200,
        height: object.height ?? 200,
        overflow: "hidden",
      }}
      dangerouslySetInnerHTML={html ? { __html: html } : undefined}
    />
  )
}

export default ImportedSvgPreviewer
