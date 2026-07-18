"use client"

import React from "react"
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  GripVertical,
  Grid2x2,
  Image as ImageIcon,
  Layers,
  Shapes as ShapesIcon,
  Trash2,
  Type,
  X,
} from "lucide-react"
import {
  CanvasObject,
  getStackingOrder,
  useCanvasStore,
} from "@/store/canvasstore"
import { useLayersPanelStore } from "@/store/layerspanelstore"
import { PATTERNS } from "@/lib/patterns"

const typeIcon = (object: CanvasObject) => {
  switch (object.type) {
    case "text":
      return <Type className="h-4 w-4" />
    case "image":
      return <ImageIcon className="h-4 w-4" />
    case "pattern":
      return <Grid2x2 className="h-4 w-4" />
    case "shape":
      return <ShapesIcon className="h-4 w-4" />
    default:
      return <Layers className="h-4 w-4" />
  }
}

const layerLabel = (object: CanvasObject) => {
  switch (object.type) {
    case "text": {
      const text = (object.content ?? "").trim()
      return text ? (text.length > 24 ? `${text.slice(0, 24)}…` : text) : "Text"
    }
    case "image":
      return "Image"
    case "pattern": {
      const label = PATTERNS.find((p) => p.type === object.patternType)?.label
      return label ? `${label} Pattern` : "Pattern"
    }
    case "shape":
      return object.shapeType
        ? `${object.shapeType.charAt(0).toUpperCase()}${object.shapeType.slice(1)}`
        : "Shape"
    default:
      return "Layer"
  }
}

const LayersSidebar = () => {
  const open = useLayersPanelStore((state) => state.open)
  const setOpen = useLayersPanelStore((state) => state.setOpen)

  const objects = useCanvasStore((state) => state.objects)
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((state) => state.setSelectedObjectId)
  const bringForward = useCanvasStore((state) => state.bringForward)
  const sendBackward = useCanvasStore((state) => state.sendBackward)
  const toggleObjectHidden = useCanvasStore((state) => state.toggleObjectHidden)
  const removeObject = useCanvasStore((state) => state.removeObject)
  const reorderObjects = useCanvasStore((state) => state.reorderObjects)

  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dragOverId, setDragOverId] = React.useState<string | null>(null)

  // Top-to-bottom: stacking order is bottom-to-top, so reverse it.
  const layers = React.useMemo(
    () => [...getStackingOrder(objects)].reverse(),
    [objects],
  )

  const handleDrop = (targetId: string) => {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }
    const orderedIds = layers.map((object) => object.id)
    const from = orderedIds.indexOf(draggingId)
    const to = orderedIds.indexOf(targetId)
    if (from < 0 || to < 0) {
      setDraggingId(null)
      setDragOverId(null)
      return
    }
    const next = [...orderedIds]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    // reorderObjects expects top-to-bottom ids, which is exactly `next`.
    reorderObjects(next)
    setDraggingId(null)
    setDragOverId(null)
  }

  return (
    <aside
      aria-hidden={!open}
      className={`absolute inset-y-0 right-0 z-30 flex h-full w-[26vw] lg:w-[24vw] min-w-[220px] max-w-[360px] flex-col border-l border-border bg-sidebar text-sidebar-foreground shadow-xl transition-transform duration-200 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span className="text-sm font-semibold">Layers</span>
        </div>
        <button
          type="button"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          aria-label="Close layers panel"
          onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {layers.length === 0 && (
          <div className="m-2 rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
            No elements on the canvas yet.
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          {layers.map((object, index) => {
            const isSelected = object.id === selectedObjectId
            const isTop = index === 0
            const isBottom = index === layers.length - 1
            const isDragOver = dragOverId === object.id && draggingId !== object.id
            return (
              <div
                key={object.id}
                draggable
                onDragStart={() => setDraggingId(object.id)}
                onDragEnd={() => {
                  setDraggingId(null)
                  setDragOverId(null)
                }}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragOverId(object.id)
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  handleDrop(object.id)
                }}
                onClick={() => setSelectedObjectId(object.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-2 py-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-accent"
                    : "border-border hover:bg-accent/50"
                } ${object.hidden ? "opacity-60" : ""} ${
                  isDragOver ? "border-primary" : ""
                } ${draggingId === object.id ? "opacity-40" : ""}`}
              >
                <span className="cursor-grab text-muted-foreground active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </span>
                <span className="text-muted-foreground">{typeIcon(object)}</span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {layerLabel(object)}
                </span>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30"
                    disabled={isTop}
                    aria-label="Move layer up"
                    onClick={(event) => {
                      event.stopPropagation()
                      bringForward(object.id)
                    }}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30"
                    disabled={isBottom}
                    aria-label="Move layer down"
                    onClick={(event) => {
                      event.stopPropagation()
                      sendBackward(object.id)
                    }}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground"
                    aria-label={object.hidden ? "Show layer" : "Hide layer"}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleObjectHidden(object.id)
                    }}
                  >
                    {object.hidden ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-destructive"
                    aria-label="Remove layer"
                    onClick={(event) => {
                      event.stopPropagation()
                      removeObject(object.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

export default LayersSidebar
