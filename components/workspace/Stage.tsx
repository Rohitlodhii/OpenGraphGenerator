"use client"

import React, { useRef } from "react"
import Draggable, { DraggableData } from "react-draggable"
import { useCanvasStore } from "@/store/canvasstore"

type StageProps = {
  width: number
  height: number
  zoom: number
  locked?: boolean
  position?: { x: number; y: number }
  onPositionChange?: (pos: { x: number; y: number }) => void
  children: React.ReactNode
}

const Stage: React.FC<StageProps> = ({ width, height, zoom, locked = false, position, onPositionChange, children }) => {
  const dragRef = useRef<HTMLDivElement>(null)
  const setSelectedObjectId = useCanvasStore((state) => state.setSelectedObjectId)

  const draggableProps = position
    ? {
        position,
        onDrag: (_e: unknown, data: DraggableData) => onPositionChange?.({ x: data.x, y: data.y }),
      }
    : { defaultPosition: { x: 0, y: 0 } }

  return (
    <Draggable nodeRef={dragRef} disabled={locked} cancel=".canvas-object" {...draggableProps}>
      <div ref={dragRef} className={locked ? "" : "cursor-grab active:cursor-grabbing"}>
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "center",
          }}
        >
          <div
            className="canvas-stage relative overflow-hidden shadow-xl rounded-lg"
            style={{
              width,
              height,
            }}
            onMouseDown={(event) => {
              // Clear selection only when the click did not land on a canvas
              // object (objects handle their own selection). This lets the
              // mousedown from an object bubble here without deselecting it.
              const target = event.target as HTMLElement
              if (!target.closest(".canvas-object")) {
                setSelectedObjectId(null)
              }
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default Stage
