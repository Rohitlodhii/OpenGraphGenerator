"use client"

import React from "react"
import {
  ArrowUp,
  ArrowUpToLine,
  ArrowDown,
  ArrowDownToLine,
  Trash2,
} from "lucide-react"
import { CanvasObject, useCanvasStore } from "@/store/canvasstore"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../ui/context-menu"
import {
  buildPatternSvg,
  patternToDataUri,
  DEFAULT_PATTERN_COLOR,
  DEFAULT_PATTERN_SCALE,
} from "@/lib/patterns"

type PatternObjectRendererProps = {
  object: CanvasObject
  order: number
}

// Renders a pattern object as a full-canvas tiled overlay. It isn't draggable
// or resizable (it covers the whole canvas) but participates in the shared
// zIndex layering system, so it can be moved above/below other objects.
const PatternObjectRenderer: React.FC<PatternObjectRendererProps> = ({ object, order }) => {
  const removeObject = useCanvasStore((state) => state.removeObject)
  const bringForward = useCanvasStore((state) => state.bringForward)
  const sendBackward = useCanvasStore((state) => state.sendBackward)
  const bringToFront = useCanvasStore((state) => state.bringToFront)
  const sendToBack = useCanvasStore((state) => state.sendToBack)
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((state) => state.setSelectedObjectId)

  const opacity = Math.max(0, Math.min(100, object.patternOpacity ?? 100)) / 100
  const svg = buildPatternSvg(object.patternType ?? "dots", {
    width: 1200,
    height: 630,
    size: object.patternScale ?? DEFAULT_PATTERN_SCALE,
    color: object.patternColor ?? DEFAULT_PATTERN_COLOR,
  })
  const isSelected = selectedObjectId === object.id

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="canvas-object absolute inset-0"
        style={{
          zIndex: object.zIndex ?? order + 1,
          backgroundImage: patternToDataUri(svg),
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          opacity,
          outline: isSelected ? "2px solid var(--primary)" : undefined,
          outlineOffset: -2,
        }}
      />
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
        <ContextMenuItem variant="destructive" onClick={() => removeObject(object.id)}>
          <Trash2 />
          Remove
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default PatternObjectRenderer





