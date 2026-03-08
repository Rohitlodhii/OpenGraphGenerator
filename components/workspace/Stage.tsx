"use client"

import React, { useRef } from "react"
import Draggable from "react-draggable"
import { useCanvasStore } from "@/store/canvasstore"

type StageProps = {
  width: number
  height: number
  zoom: number
  children: React.ReactNode
}

const Stage: React.FC<StageProps> = ({ width, height, zoom, children }) => {
  const dragRef = useRef<HTMLDivElement>(null)
  const setSelectedObjectId = useCanvasStore((state) => state.setSelectedObjectId)

  return (
    <Draggable nodeRef={dragRef} defaultPosition={{ x: 0, y: 0 }} cancel=".canvas-object">
      <div ref={dragRef} className="cursor-grab active:cursor-grabbing">
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
            onMouseDown={() => setSelectedObjectId(null)}
          >
            {children}
          </div>
        </div>
      </div>
    </Draggable>
  )
}

export default Stage
