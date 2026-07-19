"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { ImagePlus, Minus, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useCanvasStore } from "@/store/canvasstore"
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "../ui/accordion"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "../ui/select"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"

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

const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
]

const ImageAddingPanel = ({ isOpen, onToggle, chromeless = false }: ImageAddingPanelProps) => {
  const expanded = chromeless ? true : isOpen
  const { objects, selectedObjectId, addObject, updateObject, removeObject, setSelectedObjectId } =
    useCanvasStore()
  const [openItems, setOpenItems] = useState<string[]>([])

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

  // Auto-expand accordion when image is selected on canvas
  useEffect(() => {
    if (!selectedObjectId) return
    const isImage = imageObjects.some((image) => image.id === selectedObjectId)
    if (!isImage) return
    setOpenItems((prev) => (prev.includes(selectedObjectId) ? prev : [...prev, selectedObjectId]))
  }, [selectedObjectId, imageObjects])

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
        imageBlendMode: "normal",
        imageGrain: 0,
        imageBlur: 0,
        imageBorderRadius: 8,
      })
    })

    event.target.value = ""
  }

  const compactButton = "h-8 rounded-md px-3 text-xs"
  const compactIconButton = "h-8 w-8 rounded-md p-0 shrink-0"
  const compactInput = "h-8 w-full min-w-0 flex-1 rounded-md px-2 text-xs focus-visible:ring-0 focus-visible:border-input"

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
              <Accordion value={openItems} onValueChange={(value) => setOpenItems(value as string[])}>
                {imageObjects.map((image) => (
                  <AccordionItem
                    key={image.id}
                    value={image.id}
                    className="border border-border rounded-md bg-card overflow-hidden"
                  >
                    <AccordionTrigger className="w-full h-8 px-2 flex items-center justify-between gap-2 py-0 text-xs text-muted-foreground [&_[data-slot=accordion-indicator]]:hidden">
                      <span className="text-xs text-muted-foreground">Image {image.id.slice(0, 4)}</span>
                      <button
                        className="text-destructive"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          removeObject(image.id)
                        }}
                        aria-label="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </AccordionTrigger>

                    <AccordionPanel className="pb-0 border-t border-border">
                      <div className="flex flex-col gap-1.5 p-2">
                        {/* Crop Section */}
                        <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                          Crop Zoom
                        </span>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="secondary"
                            size="sm"
                            className={compactIconButton}
                            onClick={() =>
                              updateObject(image.id, {
                                imageCropScale: Math.max(1, (image.imageCropScale ?? 1) - 0.05),
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
                              updateObject(image.id, {
                                imageCropScale: Math.min(4, (image.imageCropScale ?? 1) + 0.05),
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            step="0.05"
                            value={(image.imageCropScale ?? 1).toFixed(2)}
                            onChange={(event) => {
                              const parsed = Number(event.target.value)
                              if (Number.isNaN(parsed)) return
                              updateObject(image.id, {
                                imageCropScale: Math.max(1, Math.min(4, parsed)),
                              })
                            }}
                            className={compactInput}
                          />
                        </div>

                        <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                          Crop Offset
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex h-8 items-center gap-2 rounded-md border border-border px-2">
                            <span className="text-xs font-medium text-muted-foreground">X</span>
                            <input
                              type="number"
                              value={Math.round(image.imageCropX ?? 0)}
                              onChange={(event) => {
                                const parsed = Number(event.target.value)
                                if (Number.isNaN(parsed)) return
                                updateObject(image.id, { imageCropX: parsed })
                              }}
                              className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          </div>
                          <div className="flex h-8 items-center gap-2 rounded-md border border-border px-2">
                            <span className="text-xs font-medium text-muted-foreground">Y</span>
                            <input
                              type="number"
                              value={Math.round(image.imageCropY ?? 0)}
                              onChange={(event) => {
                                const parsed = Number(event.target.value)
                                if (Number.isNaN(parsed)) return
                                updateObject(image.id, { imageCropY: parsed })
                              }}
                              className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          </div>
                        </div>

                        {/* Appearance Section */}
                        <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                          Appearance
                        </span>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Border Radius</span>
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              value={Math.round(image.imageBorderRadius ?? 8)}
                              onChange={(event) => {
                                const parsed = Number(event.target.value)
                                if (Number.isNaN(parsed)) return
                                updateObject(image.id, {
                                  imageBorderRadius: Math.max(0, Math.min(50, parsed)),
                                })
                              }}
                              className={compactInput}
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-muted-foreground">Blend Mode</span>
                            <Select
                              value={image.imageBlendMode ?? "normal"}
                              onValueChange={(value) => updateObject(image.id, { imageBlendMode: value })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectPopup>
                                {BLEND_MODES.map((mode) => (
                                  <SelectItem key={mode} value={mode}>
                                    {mode}
                                  </SelectItem>
                                ))}
                              </SelectPopup>
                            </Select>
                          </div>
                        </div>

                        {/* Effects Section */}
                        <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                          Effects
                        </span>
                        <SliderWithInput
                          key={`image-blur-${image.id}`}
                          defaultValue={[image.imageBlur ?? 0]}
                          initialValue={[image.imageBlur ?? 0]}
                          label="Blur"
                          maxValue={100}
                          inputMaxValue={1000}
                          minValue={0}
                          step={1}
                          onChange={(vals) => updateObject(image.id, { imageBlur: vals[0] })}
                        />
                        <SliderWithInput
                          key={`image-grain-${image.id}`}
                          defaultValue={[image.imageGrain ?? 0]}
                          initialValue={[image.imageGrain ?? 0]}
                          label="Grain"
                          maxValue={100}
                          minValue={0}
                          step={1}
                          onChange={(vals) => updateObject(image.id, { imageGrain: vals[0] })}
                        />

                        {/* Stroke Section */}
                        <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                          Stroke
                        </span>
                        {!image.imageStrokeColor ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            className={compactButton}
                            onClick={() =>
                              updateObject(image.id, {
                                imageStrokeColor: "#000000",
                                imageStrokeWidth: 2,
                              })
                            }
                          >
                            <Plus className="h-4 w-4" />
                            Add Stroke
                          </Button>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <ColorPopup
                              color={image.imageStrokeColor}
                              onChange={(hex) => updateObject(image.id, { imageStrokeColor: hex })}
                              label=""
                              className=""
                            />
                            <SliderWithInput
                              key={`image-stroke-width-${image.id}`}
                              defaultValue={[image.imageStrokeWidth ?? 2]}
                              initialValue={[image.imageStrokeWidth ?? 2]}
                              label="Width"
                              maxValue={20}
                              minValue={1}
                              step={1}
                              onChange={(vals) => updateObject(image.id, { imageStrokeWidth: vals[0] })}
                            />
                            <Button
                              variant="secondary"
                              size="sm"
                              className={`${compactButton} text-destructive`}
                              onClick={() =>
                                updateObject(image.id, {
                                  imageStrokeColor: undefined,
                                  imageStrokeWidth: undefined,
                                })
                              }
                            >
                              Remove Stroke
                            </Button>
                          </div>
                        )}

                        <Button
                          size="sm"
                          variant="secondary"
                          className={`${compactButton} mt-2`}
                          onClick={() =>
                            updateObject(image.id, {
                              imageCropScale: 1,
                              imageCropX: 0,
                              imageCropY: 0,
                              imageBlur: 0,
                              imageGrain: 0,
                              imageBorderRadius: 8,
                              imageBlendMode: "normal",
                              imageStrokeColor: undefined,
                              imageStrokeWidth: undefined,
                            })
                          }
                        >
                          Reset All
                        </Button>
                      </div>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageAddingPanel
