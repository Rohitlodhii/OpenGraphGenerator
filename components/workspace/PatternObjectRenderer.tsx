"use client"

import React from "react"
import { CanvasObject } from "@/store/canvasstore"
import {
  buildPatternStyle,
  DEFAULT_PATTERN_COLOR,
  DEFAULT_PATTERN_SCALE,
} from "@/lib/patterns"

type PatternObjectRendererProps = {
  object: CanvasObject
  order: number
}

// Renders a pattern object as a full-canvas tiled overlay. It isn't draggable
// or resizable (it covers the whole canvas) and is intentionally unselectable
// (pointer-events: none) since it sits on top of every other object and would
// otherwise steal clicks meant for them. Layer controls (color/scale/opacity/
// reorder/remove) live in PatternsPanel instead of a canvas context menu.
const PatternObjectRenderer: React.FC<PatternObjectRendererProps> = ({ object, order }) => {
  const opacity = Math.max(0, Math.min(100, object.patternOpacity ?? 100)) / 100
  const patternStyle = buildPatternStyle(object.patternType ?? "dots", {
    width: 1200,
    height: 630,
    size: object.patternScale ?? DEFAULT_PATTERN_SCALE,
    color: object.patternColor ?? DEFAULT_PATTERN_COLOR,
  })

  return (
    <span
      className="pointer-events-none absolute inset-0"
      style={{
        zIndex: object.zIndex ?? order + 1,
        ...patternStyle,
        opacity,
      }}
    />
  )
}

export default PatternObjectRenderer
