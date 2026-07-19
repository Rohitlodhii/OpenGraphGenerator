"use client"

import React from "react"
import { prepareSvg } from "@/lib/svgutils"

type Props = {
  svg: string
  className?: string
}

// Renders a raw SVG string inline, filling its parent. Each instance gets a
// unique id namespace (via useId) so duplicate exports never collide.
const RawGradientSvg: React.FC<Props> = ({ svg, className }) => {
  const rawId = React.useId()
  const prefix = `g${rawId.replace(/[^a-zA-Z0-9]/g, "")}`
  const prepared = React.useMemo(() => prepareSvg(svg, prefix), [svg, prefix])

  return (
    <div
      className={className}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      dangerouslySetInnerHTML={{ __html: prepared }}
    />
  )
}

export default RawGradientSvg
