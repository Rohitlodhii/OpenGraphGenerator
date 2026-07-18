"use client"

import React, { useMemo } from "react"
import { Crop, ImagePlus, Minus, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useCanvasStore } from "@/store/canvasstore"

type ImageAddingPanelProps = {
  isOpen?: boolean
  onToggle?: () => void
  chromeless?: boolean
}

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `image-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const ImageAddingPanel = ({ isOpen, onToggle, chromeless = false }: ImageAddingPanelProps) => {
  const expanded = chromeless ? true : isOpen
  const { objects, selectedObjectId, addObject, updateObject, removeObject, setSelectedObjectId } =
    useCanvasStore()

  const imageObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "image")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  const selectedImageObject = useMemo(() => {
    const selected = imageObjects.find((obj) => obj.id === selectedObjectId)
    return selected ?? null
  }, [imageObjects, selectedObjectId])

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    Array.from(files).forEach((file, index) => {
      const src = URL.createObjectURL(file)
      addObject({
        id: createId(),
        type: "image",
        src,
        x: 80 + index * 10,
        y: 80 + index * 10,
        width: 260,
        height: 180,
        zIndex: maxZIndex + index + 1,
        imageCropX: 0,
        imageCropY: 0,
        imageCropScale: 1,
      })
    })

    event.target.value = ""
  }

  const compactButton = "h-8 rounded-md px-3 text-xs"
  const compactIconButton = "h-8 w-8 rounded-md p-0"
  const compactInput = "h-8 w-20 rounded-md px-2 text-sm focus-visible:ring-0 focus-visible:border-input"

  return (
    <div
      className={
        chromeless
          ? "flex w-full flex-col"
          : "border border-border flex flex-col rounded-xl items-center overflow-hidden"
      }
    >
      {!chromeless && (
        <div
          className="flex gap-2 items-center justify-between w-full bg-sidebar h-14 px-4 border-b border-border cursor-pointer select-none"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onToggle?.()
            }
          }}
        >
          <span className="text-sm font-medium">Images</span>
          <ImagePlus className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div
        className={
          chromeless
            ? "w-full"
            : `w-full px-4 transition-all duration-200 ${
                expanded ? "py-3" : "max-h-0 py-0 overflow-hidden"
              }`
        }
      >
        <div className="w-full flex flex-col gap-3">
          <label className="flex items-center justify-center gap-2 px-3 py-3 bg-muted/40 border border-border/40 rounded-xl cursor-pointer hover:bg-muted transition">
            <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
            <Upload className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Upload & Add Images</span>
          </label>

          {imageObjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Image Layers</span>
              <div className="flex flex-col gap-1.5">
                {imageObjects.map((item) => (
                  <div
                    key={item.id}
                    className={`h-10 border rounded-md px-3 flex items-center justify-between gap-2 ${
                      selectedObjectId === item.id ? "border-primary" : "border-border"
                    }`}
                  >
                    <button
                      className="text-sm text-left truncate flex-1"
                      onClick={() => setSelectedObjectId(item.id)}
                    >
                      Image {item.id.slice(0, 4)}
                    </button>
                    <button
                      className="text-destructive"
                      onClick={() => removeObject(item.id)}
                      aria-label="Delete image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedImageObject && (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">Crop Zoom</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className={compactIconButton}
                    onClick={() =>
                      updateObject(selectedImageObject.id, {
                        imageCropScale: Math.max(1, (selectedImageObject.imageCropScale ?? 1) - 0.05),
                      })
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className={compactIconButton}
                    onClick={() =>
                      updateObject(selectedImageObject.id, {
                        imageCropScale: Math.min(4, (selectedImageObject.imageCropScale ?? 1) + 0.05),
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    step="0.05"
                    value={(selectedImageObject.imageCropScale ?? 1).toFixed(2)}
                    onChange={(event) => {
                      const parsed = Number(event.target.value)
                      if (Number.isNaN(parsed)) return
                      updateObject(selectedImageObject.id, {
                        imageCropScale: Math.max(1, Math.min(4, parsed)),
                      })
                    }}
                    className={compactInput}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Crop className="h-4 w-4" />
                  Crop Offset
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex gap-2 h-10 border border-border rounded-md px-3 items-center">
                    <span className="text-sm">X</span>
                    <input
                      type="number"
                      value={Math.round(selectedImageObject.imageCropX ?? 0)}
                      onChange={(event) => {
                        const parsed = Number(event.target.value)
                        if (Number.isNaN(parsed)) return
                        updateObject(selectedImageObject.id, { imageCropX: parsed })
                      }}
                      className="h-full border-0 ring-0 outline-0 text-sm w-full bg-transparent"
                    />
                  </div>
                  <div className="flex gap-2 h-10 border border-border rounded-md px-3 items-center">
                    <span className="text-sm">Y</span>
                    <input
                      type="number"
                      value={Math.round(selectedImageObject.imageCropY ?? 0)}
                      onChange={(event) => {
                        const parsed = Number(event.target.value)
                        if (Number.isNaN(parsed)) return
                        updateObject(selectedImageObject.id, { imageCropY: parsed })
                      }}
                      className="h-full border-0 ring-0 outline-0 text-sm w-full bg-transparent"
                    />
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                className={compactButton}
                onClick={() =>
                  updateObject(selectedImageObject.id, {
                    imageCropScale: 1,
                    imageCropX: 0,
                    imageCropY: 0,
                  })
                }
              >
                Reset Crop
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageAddingPanel
