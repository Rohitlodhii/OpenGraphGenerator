"use client"

import React from "react"
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Grid2x2,
  Image as ImageIcon,
  Layers,
  Shapes as ShapesIcon,
  Trash2,
  Type,
} from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import { Button } from "../ui/button"
import {
  CanvasObject,
  getStackingOrder,
  useCanvasStore,
} from "@/store/canvasstore"
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

const LayersDialog = () => {
  const {
    objects,
    selectedObjectId,
    setSelectedObjectId,
    bringForward,
    sendBackward,
    toggleObjectHidden,
    removeObject,
  } = useCanvasStore()

  // Top-to-bottom: stacking order is bottom-to-top, so reverse it.
  const layers = React.useMemo(
    () => [...getStackingOrder(objects)].reverse(),
    [objects],
  )

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <Layers className="h-4 w-4" />
            Layers
          </Button>
        }
      />
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Layers</DialogTitle>
          <DialogDescription>
            Reorder, hide, or remove every element on the canvas.
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-[60vh] flex-col gap-1.5 overflow-y-auto px-1 pb-1">
          {layers.length === 0 && (
            <div className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
              No elements on the canvas yet.
            </div>
          )}

          {layers.map((object, index) => {
            const isSelected = object.id === selectedObjectId
            const isTop = index === 0
            const isBottom = index === layers.length - 1
            return (
              <div
                key={object.id}
                onClick={() => setSelectedObjectId(object.id)}
                className={`flex items-center gap-2 rounded-lg border px-2 py-2 transition-colors ${
                  isSelected
                    ? "border-primary bg-accent"
                    : "border-border hover:bg-accent/50"
                } ${object.hidden ? "opacity-60" : ""}`}
              >
                <span className="text-muted-foreground">{typeIcon(object)}</span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {layerLabel(object)}
                </span>

                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30"
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
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground disabled:opacity-30"
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
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground"
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
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-destructive"
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
      </DialogContent>
    </Dialog>
  )
}

export default LayersDialog
