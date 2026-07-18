"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { CanvasObject, useCanvasStore } from "@/store/canvasstore"
import TextPreviewer from "../previewers/TextPreviewer"
import ImageObjectPreviewer from "../previewers/ImageObjectPreviewer"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu"
import {
  ArrowUp,
  ArrowUpToLine,
  ArrowDown,
  ArrowDownToLine,
  Trash2,
} from "lucide-react"

type CanvasObjectRendererProps = {
  object: CanvasObject
  zoom: number
  order: number
}

const CanvasObjectRenderer: React.FC<CanvasObjectRendererProps> = ({ object, zoom, order }) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  const updateObject = useCanvasStore((state) => state.updateObject)
  const removeObject = useCanvasStore((state) => state.removeObject)
  const bringForward = useCanvasStore((state) => state.bringForward)
  const sendBackward = useCanvasStore((state) => state.sendBackward)
  const bringToFront = useCanvasStore((state) => state.bringToFront)
  const sendToBack = useCanvasStore((state) => state.sendToBack)
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((state) => state.setSelectedObjectId)
  const [isResizing, setIsResizing] = useState(false)
  const [isEditingText, setIsEditingText] = useState(false)
  const isTextEditing = isEditingText && selectedObjectId === object.id
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    width: object.width ?? 200,
    height: object.height ?? 200,
  })

  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    updateObject(object.id, { x: data.x, y: data.y })
  }

  const handleResizeMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    resizeStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      width: object.width ?? 200,
      height: object.height ?? 200,
    }
    setIsResizing(true)
  }

  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (event: MouseEvent) => {
      const scale = zoom / 100
      const deltaX = (event.clientX - resizeStartRef.current.mouseX) / scale
      const deltaY = (event.clientY - resizeStartRef.current.mouseY) / scale
      const minSize = 24

      let nextWidth = Math.max(minSize, resizeStartRef.current.width + deltaX)
      let nextHeight = Math.max(minSize, resizeStartRef.current.height + deltaY)

      if (object.shapeType === "square" || object.shapeType === "circle") {
        const nextSize = Math.max(nextWidth, nextHeight)
        nextWidth = nextSize
        nextHeight = nextSize
      }

      updateObject(object.id, {
        width: nextWidth,
        height: nextHeight,
      })
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, object.id, object.shapeType, updateObject, zoom])

  const contentStyle = useMemo<React.CSSProperties>(
    () => ({
      width: object.width,
      height: object.height,
      transform: object.rotation ? `rotate(${object.rotation}deg)` : undefined,
      transformOrigin: "center",
      filter: object.blur ? `blur(${object.blur}px)` : undefined,
    }),
    [object.blur, object.height, object.rotation, object.width],
  )

  const renderObject = () => {
    if (object.type === "text") {
      return (
        <TextPreviewer
          object={object}
          style={contentStyle}
          isSelected={selectedObjectId === object.id}
          isEditing={isTextEditing}
          onDoubleClick={() => {
            setSelectedObjectId(object.id)
            setIsEditingText(true)
          }}
          onChange={(value) => updateObject(object.id, { content: value })}
          onBlur={() => setIsEditingText(false)}
        />
      )
    }

    if (object.type === "image") {
      return <ImageObjectPreviewer object={object} style={contentStyle} />
    }

    if (object.type === "shape") {
      const width = object.width ?? 160
      const height = object.height ?? 160
      const fill = object.fill ?? "#ffffff"
      const shapeOpacity = Math.max(0, Math.min(100, object.shapeOpacity ?? 100)) / 100
      const strokeColor = object.strokeColor
      const strokeWidth = object.strokeColor ? object.strokeWidth ?? 2 : 0
      const shadowColor = object.shapeShadowColor
      const shadowSize = Math.max(0, object.shapeShadow ?? 0)
      const boxShadow =
        shadowColor && shadowSize > 0 ? `0 2px ${shadowSize}px ${shadowColor}` : undefined
      const triangleFilter = [
        object.blur ? `blur(${object.blur}px)` : "",
        boxShadow ? `drop-shadow(${boxShadow})` : "",
      ]
        .filter(Boolean)
        .join(" ")

      if (object.shapeType === "triangle") {
        return (
          <svg
            style={{
              ...contentStyle,
              width,
              height,
              opacity: shapeOpacity,
              filter: triangleFilter || undefined,
              overflow: "visible",
            }}
            viewBox={`0 0 ${width} ${height}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points={`${width / 2},0 ${width},${height} 0,${height}`}
              fill={fill}
              stroke={strokeColor ?? "none"}
              strokeWidth={strokeWidth}
            />
          </svg>
        )
      }

      return (
        <div
          style={{
            ...contentStyle,
            width,
            height,
            backgroundColor: fill,
            borderRadius:
              object.shapeType === "circle"
                ? "9999px"
                : object.shapeType === "rectangle"
                  ? "10px"
                  : "4px",
            border:
              strokeColor && strokeWidth > 0
                ? `${strokeWidth}px solid ${strokeColor}`
                : undefined,
            opacity: shapeOpacity,
            boxShadow,
            boxSizing: "border-box",
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
    <ContextMenu>
      <Draggable
        nodeRef={nodeRef}
        scale={zoom / 100}
        position={{ x: object.x, y: object.y }}
        onDrag={handleDrag}
        disabled={isResizing || isTextEditing}
      >
        <ContextMenuTrigger
          ref={nodeRef}
          className={`canvas-object absolute select-none ${isTextEditing ? "cursor-text" : "cursor-move"}`}
          style={{
            left: 0,
            top: 0,
            zIndex: object.zIndex ?? order + 1,
            outline:
              selectedObjectId === object.id ? "2px solid hsl(var(--primary))" : undefined,
            outlineOffset: selectedObjectId === object.id ? 2 : 0,
          }}
          onMouseDown={(event) => {
            event.stopPropagation()
            setSelectedObjectId(object.id)
          }}
        >
          {renderObject()}
          {selectedObjectId === object.id && !isTextEditing && (
            <div
              className="absolute -right-2 -bottom-2 h-4 w-4 rounded-full border border-border bg-card cursor-se-resize"
              onMouseDown={handleResizeMouseDown}
            />
          )}
        </ContextMenuTrigger>
      </Draggable>
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            setSelectedObjectId(object.id)
            bringToFront(object.id)
          }}
        >
          <ArrowUpToLine />
          Bring to front
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setSelectedObjectId(object.id)
            bringForward(object.id)
          }}
        >
          <ArrowUp />
          Bring forward
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setSelectedObjectId(object.id)
            sendBackward(object.id)
          }}
        >
          <ArrowDown />
          Send backward
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            setSelectedObjectId(object.id)
            sendToBack(object.id)
          }}
        >
          <ArrowDownToLine />
          Send to back
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={() => removeObject(object.id)}
        >
          <Trash2 />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default CanvasObjectRenderer
