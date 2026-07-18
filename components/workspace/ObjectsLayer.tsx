"use client"

import React, { useMemo } from "react"
import { useCanvasStore } from "@/store/canvasstore"
import CanvasObjectRenderer from "./CanvasObjectRenderer"
import PatternObjectRenderer from "./PatternObjectRenderer"

type ObjectsLayerProps = {
  zoom: number
}

const ObjectsLayer: React.FC<ObjectsLayerProps> = ({ zoom }) => {
  const objects = useCanvasStore((state) => state.objects)

  const orderedObjects = useMemo(
    () =>
      [...objects].sort((a, b) => {
        if ((a.zIndex ?? 0) === (b.zIndex ?? 0)) {
          return 0
        }
        return (a.zIndex ?? 0) - (b.zIndex ?? 0)
      }),
    [objects],
  )

  return (
    <div className="absolute inset-0">
      {orderedObjects.map((object, index) => {
        // Hidden layers (toggled in the layers panel) render nothing.
        if (object.hidden) return null
        if (object.type === "pattern") {
          return (
            <PatternObjectRenderer key={object.id} object={object} order={index} />
          )
        }
        return (
          <CanvasObjectRenderer key={object.id} object={object} zoom={zoom} order={index} />
        )
      })}
    </div>
  )
}

export default ObjectsLayer

