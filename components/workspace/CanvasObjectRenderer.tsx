"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Draggable, { DraggableData, DraggableEvent } from "react-draggable"
import { CanvasObject, useCanvasStore } from "@/store/canvasstore"
import TextPreviewer from "../previewers/TextPreviewer"
import ImageObjectPreviewer from "../previewers/ImageObjectPreviewer"
import BlobObjectPreviewer from "../previewers/BlobObjectPreviewer"
import MotifObjectPreviewer from "../previewers/MotifObjectPreviewer"
import ImportedSvgPreviewer from "../previewers/ImportedSvgPreviewer"
import MockupObjectPreviewer from "../previewers/MockupObjectPreviewer"
import AsciiObjectPreviewer from "../previewers/AsciiObjectPreviewer"
import CssPresetPreviewer from "../previewers/CssPresetPreviewer"
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
  Copy,
  GripHorizontal,
  GripVertical,
  ImageDown,
  Trash2,
} from "lucide-react"
import { useBackgroundStore } from "@/store/backgroundstore"
import { useImageStore } from "@/store/imagestore"
import { buildShapeGradientCss, getShapeGradientSvgVector } from "@/lib/shape-gradient"

type CanvasObjectRendererProps = {
  object: CanvasObject
  zoom: number
  order: number
}

type ResizeHandle = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

const CanvasObjectRenderer: React.FC<CanvasObjectRendererProps> = ({ object, zoom, order }) => {
  const nodeRef = useRef<HTMLDivElement>(null)
  const updateObject = useCanvasStore((state) => state.updateObject)
  const removeObject = useCanvasStore((state) => state.removeObject)
  const duplicateObject = useCanvasStore((state) => state.duplicateObject)
  const bringForward = useCanvasStore((state) => state.bringForward)
  const sendBackward = useCanvasStore((state) => state.sendBackward)
  const bringToFront = useCanvasStore((state) => state.bringToFront)
  const sendToBack = useCanvasStore((state) => state.sendToBack)
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((state) => state.setSelectedObjectId)
  const setBackgroundSrc = useImageStore((state) => state.setSrc)
  const setBackgroundOpacity = useImageStore((state) => state.setOpacity)
  const setBackgroundType = useBackgroundStore((state) => state.setBackgroundType)
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null)
  const [isEditingText, setIsEditingText] = useState(false)
  const isTextEditing = isEditingText && selectedObjectId === object.id
  const resizeStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    x: object.x,
    y: object.y,
    width: object.width ?? 200,
    height: object.height ?? 200,
  })

  const handleDrag = (_event: DraggableEvent, data: DraggableData) => {
    updateObject(object.id, { x: data.x, y: data.y })
  }

  // Promote this image to the canvas background (via the image background store)
  // and remove it as a floating object so it doesn't sit on top of itself.
  const setAsBackground = () => {
    if (object.type !== "image" || !object.src) return
    setBackgroundSrc(object.src)
    setBackgroundOpacity(object.imageOpacity ?? 100)
    setBackgroundType("image")
    removeObject(object.id)
  }

  const handleResizePointerDown = (
    handle: ResizeHandle,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeStartRef.current = {
      mouseX: event.clientX,
      mouseY: event.clientY,
      x: object.x,
      y: object.y,
      width: object.width ?? 200,
      height: object.height ?? 200,
    }
    setResizeHandle(handle)
  }

  useEffect(() => {
    if (!resizeHandle) return

    const previousCursor = document.body.style.cursor
    document.body.style.cursor = resizeHandle.includes("e") || resizeHandle.includes("w")
      ? resizeHandle.includes("n") || resizeHandle.includes("s")
        ? resizeHandle === "ne" || resizeHandle === "sw"
          ? "nesw-resize"
          : "nwse-resize"
        : "ew-resize"
      : "ns-resize"

    const handlePointerMove = (event: PointerEvent) => {
      const scale = zoom / 100
      const deltaX = (event.clientX - resizeStartRef.current.mouseX) / scale
      const deltaY = (event.clientY - resizeStartRef.current.mouseY) / scale
      const minSize = 24
      const start = resizeStartRef.current
      const movesEast = resizeHandle.includes("e")
      const movesWest = resizeHandle.includes("w")
      const movesNorth = resizeHandle.includes("n")
      const movesSouth = resizeHandle.includes("s")
      const movesHorizontally = movesEast || movesWest
      const movesVertically = movesNorth || movesSouth

      let nextWidth = start.width
      let nextHeight = start.height
      let nextX = start.x
      let nextY = start.y

      if (movesEast) nextWidth = Math.max(minSize, start.width + deltaX)
      if (movesWest) {
        nextWidth = Math.max(minSize, start.width - deltaX)
        nextX = start.x + (start.width - nextWidth)
      }
      if (movesSouth) nextHeight = Math.max(minSize, start.height + deltaY)
      if (movesNorth) {
        nextHeight = Math.max(minSize, start.height - deltaY)
        nextY = start.y + (start.height - nextHeight)
      }

      if (object.shapeType === "square" || object.shapeType === "circle") {
        let nextSize: number
        if (movesHorizontally && !movesVertically) {
          nextSize = nextWidth
        } else if (movesVertically && !movesHorizontally) {
          nextSize = nextHeight
        } else {
          nextSize =
            Math.abs(nextWidth - start.width) >= Math.abs(nextHeight - start.height)
              ? nextWidth
              : nextHeight
        }
        nextSize = Math.max(minSize, nextSize)
        nextWidth = nextSize
        nextHeight = nextSize

        if (movesHorizontally && !movesVertically) {
          nextX = movesWest ? start.x + (start.width - nextSize) : start.x
          nextY = start.y + (start.height - nextSize) / 2
        } else if (movesVertically && !movesHorizontally) {
          nextX = start.x + (start.width - nextSize) / 2
          nextY = movesNorth ? start.y + (start.height - nextSize) : start.y
        } else {
          nextX = movesWest ? start.x + (start.width - nextSize) : start.x
          nextY = movesNorth ? start.y + (start.height - nextSize) : start.y
        }
      }

      updateObject(object.id, {
        x: nextX,
        y: nextY,
        width: nextWidth,
        height: nextHeight,
      })
    }

    const handlePointerUp = () => {
      setResizeHandle(null)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)
    window.addEventListener("pointercancel", handlePointerUp)

    return () => {
      document.body.style.cursor = previousCursor
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  }, [object.id, object.shapeType, resizeHandle, updateObject, zoom])

  // Delete the selected element with Delete/Backspace. Ignored while editing
  // text or when focus is in a form field (so typing in panel inputs is safe).
  useEffect(() => {
    if (selectedObjectId !== object.id || isTextEditing) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault()
        removeObject(object.id)
        return
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "d") {
        event.preventDefault()
        duplicateObject(object.id)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedObjectId, object.id, isTextEditing, removeObject, duplicateObject])

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

    if (object.type === "blob") {
      // The blob previewer applies its own blur internally, so hand it a style
      // without the outer CSS blur to avoid doubling it.
      const blobStyle: React.CSSProperties = { ...contentStyle, filter: undefined }
      return <BlobObjectPreviewer object={object} style={blobStyle} />
    }

    if (object.type === "motif") {
      // The motif previewer applies its own blur internally, so hand it a style
      // without the outer CSS blur to avoid doubling it.
      const motifStyle: React.CSSProperties = { ...contentStyle, filter: undefined }
      return <MotifObjectPreviewer object={object} style={motifStyle} />
    }

    if (object.type === "importedSvg") {
      return <ImportedSvgPreviewer object={object} style={contentStyle} />
    }

    if (object.type === "mockup") {
      return <MockupObjectPreviewer object={object} style={contentStyle} />
    }

    if (object.type === "ascii") {
      return <AsciiObjectPreviewer object={object} style={contentStyle} />
    }

    if (object.type === "cssPreset") {
      const cssStyle: React.CSSProperties = { ...contentStyle, filter: undefined }
      return <CssPresetPreviewer object={object} style={cssStyle} />
    }

    if (object.type === "shape") {
      const width = object.width ?? 160
      const height = object.height ?? 160
      const fill = object.fill ?? "#ffffff"
      const isGradient = object.shapeFillMode === "gradient"
      const gradientDirection = object.shapeGradientDirection ?? "to-b"
      const gradientColors =
        object.shapeGradientColors && object.shapeGradientColors.length >= 2
          ? object.shapeGradientColors
          : ["#6366f1", "#ec4899"]
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
      // Circles are always fully round by definition; every other shape
      // defaults to square corners (0) and is adjustable via a slider.
      const maxBorderRadius = Math.floor(Math.min(width, height) / 2)
      const borderRadius =
        object.shapeType === "circle"
          ? "9999px"
          : `${Math.min(maxBorderRadius, Math.max(0, object.shapeBorderRadius ?? 0))}px`

      if (object.shapeType === "triangle") {
        // object.id is already unique across shapes, so it doubles as a safe
        // gradient id — no risk of colliding <linearGradient>/<radialGradient>
        // ids between multiple triangles (see mockups' clipPath fix for why
        // that collision is a real bug, not a theoretical one).
        const gradientId = `shape-gradient-${object.id}`
        const vector = getShapeGradientSvgVector(gradientDirection)
        const gradientStops = gradientColors.map((color, index) => (
          <stop
            key={index}
            offset={`${gradientColors.length > 1 ? (index / (gradientColors.length - 1)) * 100 : 0}%`}
            stopColor={color}
          />
        ))
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
            {isGradient && (
              <defs>
                {vector ? (
                  <linearGradient id={gradientId} x1={vector.x1} y1={vector.y1} x2={vector.x2} y2={vector.y2}>
                    {gradientStops}
                  </linearGradient>
                ) : (
                  <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                    {gradientStops}
                  </radialGradient>
                )}
              </defs>
            )}
            <polygon
              points={`${width / 2},0 ${width},${height} 0,${height}`}
              fill={isGradient ? `url(#${gradientId})` : fill}
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
            background: isGradient
              ? buildShapeGradientCss(gradientDirection, gradientColors)
              : fill,
            borderRadius,
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
        disabled={Boolean(resizeHandle) || isTextEditing || selectedObjectId !== object.id}
      >
        <ContextMenuTrigger
          ref={nodeRef}
          className={`group/selection canvas-object absolute select-none ${
            isTextEditing
              ? "cursor-text"
              : selectedObjectId === object.id
                ? "cursor-move"
                : "cursor-grab"
          }`}
          style={{
            left: 0,
            top: 0,
            // Stays at its real stacking position while selected — no jump to
            // front — so selecting/deselecting an object behind others doesn't
            // shuffle the visible layering underneath it.
            zIndex: object.zIndex ?? order + 1,
          }}
        >
          {/* Selection is handled on this inner wrapper, not on the trigger:
              react-draggable clones the trigger and overrides its onMouseDown,
              so a handler placed directly on the trigger never fires. We do NOT
              stop propagation here so that, once selected, the mousedown still
              reaches react-draggable to begin a drag. */}
          <div
            className="contents"
            onMouseDown={() => {
              if (selectedObjectId !== object.id) {
                setSelectedObjectId(object.id)
              }
            }}
          >
            {renderObject()}
          </div>
          {selectedObjectId === object.id && !isTextEditing && (
            <>
              <div className="pointer-events-none absolute -inset-1.5 z-10 border border-primary/80" />
              <ResizeHandleButton
                handle="n"
                label="Resize height from top"
                className="-top-3.5 left-1/2 h-4 w-12 -translate-x-1/2 cursor-ns-resize"
                onPointerDown={handleResizePointerDown}
                icon={<GripHorizontal className="h-3.5 w-3.5" />}
              />
              <ResizeHandleButton
                handle="s"
                label="Resize height from bottom"
                className="-bottom-3.5 left-1/2 h-4 w-12 -translate-x-1/2 cursor-ns-resize"
                onPointerDown={handleResizePointerDown}
                icon={<GripHorizontal className="h-3.5 w-3.5" />}
              />
              <ResizeHandleButton
                handle="w"
                label="Resize width from left"
                className="-left-3.5 top-1/2 h-12 w-4 -translate-y-1/2 cursor-ew-resize"
                onPointerDown={handleResizePointerDown}
                icon={<GripVertical className="h-3.5 w-3.5" />}
              />
              <ResizeHandleButton
                handle="e"
                label="Resize width from right"
                className="-right-3.5 top-1/2 h-12 w-4 -translate-y-1/2 cursor-ew-resize"
                onPointerDown={handleResizePointerDown}
                icon={<GripVertical className="h-3.5 w-3.5" />}
              />
              <ResizeHandleButton
                handle="nw"
                label="Resize from top left"
                className="-left-3.5 -top-3.5 h-4 w-4 cursor-nwse-resize"
                onPointerDown={handleResizePointerDown}
              />
              <ResizeHandleButton
                handle="ne"
                label="Resize from top right"
                className="-right-3.5 -top-3.5 h-4 w-4 cursor-nesw-resize"
                onPointerDown={handleResizePointerDown}
              />
              <ResizeHandleButton
                handle="sw"
                label="Resize from bottom left"
                className="-bottom-3.5 -left-3.5 h-4 w-4 cursor-nesw-resize"
                onPointerDown={handleResizePointerDown}
              />
              <ResizeHandleButton
                handle="se"
                label="Resize from bottom right"
                className="-bottom-3.5 -right-3.5 h-4 w-4 cursor-nwse-resize"
                onPointerDown={handleResizePointerDown}
              />
            </>
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
        {object.type === "image" && object.src && (
          <ContextMenuItem onClick={setAsBackground}>
            <ImageDown />
            Set as background
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => duplicateObject(object.id)}>
          <Copy />
          Duplicate
        </ContextMenuItem>
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

const ResizeHandleButton = ({
  handle,
  label,
  className,
  icon,
  onPointerDown,
}: {
  handle: ResizeHandle
  label: string
  className: string
  icon?: React.ReactNode
  onPointerDown: (
    handle: ResizeHandle,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => void
}) => (
  <button
    type="button"
    aria-label={label}
    className={`group/resize-handle absolute z-20 flex items-center justify-center ${className}`}
    onPointerDown={(event) => onPointerDown(handle, event)}
  >
    <span
      className={`flex items-center justify-center border-2 border-background bg-primary text-primary-foreground shadow-sm transition-opacity duration-150 ease-out ${
        icon
          ? "h-5 min-w-5 rounded-md px-0.5 opacity-0 group-hover/resize-handle:opacity-100"
          : "h-3 w-3 rounded-[3px]"
      }`}
    >
      {icon}
    </span>
  </button>
)

export default CanvasObjectRenderer
