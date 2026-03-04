"use client"

import React, { useMemo, useRef } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { CanvasObject, useCanvasStore } from "@/store/canvasstore"

type CanvasObjectRendererProps = {
  object: CanvasObject
  zoom: number
  order: number
}

const CanvasObjectRenderer: React.FC<CanvasObjectRendererProps> = ({ object, zoom, order }) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  const updateObject = useCanvasStore((state) => state.updateObject)

  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    updateObject(object.id, { x: data.x, y: data.y })
  }

  const contentStyle = useMemo<React.CSSProperties>(
    () => ({
      width: object.width,
      height: object.height,
      transform: object.rotation ? `rotate(${object.rotation}deg)` : undefined,
      transformOrigin: "center",
    }),
    [object.height, object.rotation, object.width],
  )

  const renderObject = () => {
    if (object.type === "text") {
      return (
        <div
          style={{
            ...contentStyle,
            color: "#ffffff",
            fontSize: 36,
            fontWeight: 700,
            lineHeight: 1.2,
            whiteSpace: "pre-wrap",
          }}
        >
          {object.content ?? "Text"}
        </div>
      )
    }

    if (object.type === "image") {
      return (
        <img
          src={object.src}
          alt=""
          draggable={false}
          style={{
            ...contentStyle,
            display: "block",
            width: object.width ?? 200,
            height: object.height ?? 200,
            objectFit: "cover",
            borderRadius: 8,
          }}
        />
      )
    }

    const hasInlineSvg = !!object.content?.trim().startsWith("<svg")
    if (hasInlineSvg) {
      return (
        <div
          style={{
            ...contentStyle,
            width: object.width ?? 200,
            height: object.height ?? 200,
          }}
          dangerouslySetInnerHTML={{ __html: object.content as string }}
        />
      )
    }

    return (
      <img
        src={object.src}
        alt=""
        draggable={false}
        style={{
          ...contentStyle,
          display: "block",
          width: object.width ?? 200,
          height: object.height ?? 200,
          objectFit: "contain",
        }}
      />
    )
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      scale={zoom / 100}
      position={{ x: object.x, y: object.y }}
      onDrag={handleDrag}
    >
      <div
        ref={nodeRef}
        className="canvas-object absolute cursor-move select-none"
        style={{
          left: 0,
          top: 0,
          zIndex: object.zIndex ?? order + 1,
        }}
      >
        {renderObject()}
      </div>
    </Draggable>
  )
}

export default CanvasObjectRenderer

