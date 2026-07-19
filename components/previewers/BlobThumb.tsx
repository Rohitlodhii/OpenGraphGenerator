"use client"

import React from "react"
import { namespaceSvgIds } from "@/lib/svgutils"

type Props = {
  svg: string
  className?: string
}

// Renders a blob's raw SVG as a contained thumbnail (whole shape visible).
// Ids are namespaced per instance so gradient defs never collide across copies.
const BlobThumb: React.FC<Props> = ({ svg, className }) => {
  const rawId = React.useId()
  const prefix = `b${rawId.replace(/[^a-zA-Z0-9]/g, "")}`

  const html = React.useMemo(() => {
    const namespaced = namespaceSvgIds(svg, prefix)
    // Fit the whole blob, drop fixed size, add padding room via meet.
    return namespaced.replace(/<svg\b([^>]*)>/, (_full, attrs: string) => {
      let a = attrs
        .replace(/\swidth="[^"]*"/, "")
        .replace(/\sheight="[^"]*"/, "")
        .replace(/\spreserveAspectRatio="[^"]*"/, "")
      a += ' preserveAspectRatio="xMidYMid meet"'
      a += ' style="display:block;width:100%;height:100%"'
      return `<svg${a}>`
    })
  }, [svg, prefix])

  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default BlobThumb
