"use client"

import React, { useMemo } from "react"
import { useGridStore } from "@/store/gridstore"

type GridOverlayProps = {
  width: number
  height: number
}

// Purely visual alignment aid — never draggable/selectable and always
// excluded from export (see ExportDialog's `filter`, which skips any node
// carrying `data-export-ignore`).
const GridOverlay: React.FC<GridOverlayProps> = ({ width, height }) => {
  const gridVisible = useGridStore((s) => s.gridVisible)
  const gridLines = useGridStore((s) => s.gridLines)
  const gridColor = useGridStore((s) => s.gridColor)
  const gridOpacity = useGridStore((s) => s.gridOpacity)

  const { verticalLines, horizontalLines } = useMemo(() => {
    const cellWidth = width / gridLines
    const cellHeight = height / gridLines
    const vertical = Array.from({ length: gridLines - 1 }, (_, i) => (i + 1) * cellWidth)
    const horizontal = Array.from({ length: gridLines - 1 }, (_, i) => (i + 1) * cellHeight)
    return { verticalLines: vertical, horizontalLines: horizontal }
  }, [width, height, gridLines])

  if (!gridVisible) return null

  return (
    <div
      data-export-ignore="true"
      className="grid-overlay pointer-events-none absolute inset-0 z-[9998]"
      style={{ opacity: Math.max(0, Math.min(100, gridOpacity)) / 100 }}
    >
      <svg width={width} height={height} className="absolute inset-0">
        {verticalLines.map((x) => (
          <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} stroke={gridColor} strokeWidth={1} />
        ))}
        {horizontalLines.map((y) => (
          <line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} stroke={gridColor} strokeWidth={1} />
        ))}
      </svg>
    </div>
  )
}

export default GridOverlay
