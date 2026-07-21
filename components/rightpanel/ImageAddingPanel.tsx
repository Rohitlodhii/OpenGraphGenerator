"use client"

import React, { useMemo, useState } from "react"
import { ImageDown, ImagePlus, Layers, Minus, Plus, StickyNote, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useCanvasStore } from "@/store/canvasstore"
import { useBackgroundStore } from "@/store/backgroundstore"
import { useImageStore } from "@/store/imagestore"
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "../ui/accordion"
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "../ui/select"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"
import ImagePanel from "./ImagePanel"
import PaperTapesDialog from "./PaperTapesDialog"
import CssPresetDialog, { CssPreset } from "./CssPresetDialog"
import CssPresetLayerControls from "./CssPresetLayerControls"
import { radialGlowPresets } from "@/store/radialglowstore"
import { gradientDecorationPresets } from "@/store/gradientdecorationstore"
import {
  createEditableCssPreset,
  recolorGradientLayers,
} from "@/lib/css-presets"
import { importImageFileLocally } from "@/lib/local-image-assets"

// Overlays combine the radial-glow and gradient-decoration presets into a
// single editable-image-adjacent picker.
const OVERLAY_PRESETS: CssPreset[] = [...radialGlowPresets, ...gradientDecorationPresets]

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
  const { objects, addObject, updateObject, removeObject, setSelectedObjectId } =
    useCanvasStore()
  const setBackgroundSrc = useImageStore((state) => state.setSrc)
  const setBackgroundOpacity = useImageStore((state) => state.setOpacity)
  const backgroundSrc = useImageStore((state) => state.src)
  const backgroundType = useBackgroundStore((state) => state.backgroundType)
  const setBackgroundType = useBackgroundStore((state) => state.setBackgroundType)
  const [openItems, setOpenItems] = useState<string[]>([])
  const [paperTapesOpen, setPaperTapesOpen] = useState(false)
  const [overlaysOpen, setOverlaysOpen] = useState(false)

  // Overlay layers already placed on the canvas (radial glows + gradient decos).
  const overlayObjects = useMemo(
    () =>
      [...objects]
        .filter(
          (object) =>
            object.type === "cssPreset" &&
            (object.presetKind === "radialGlow" || object.presetKind === "gradientDecoration"),
        )
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  // Drop an overlay preset on the canvas as an editable cssPreset object.
  const addOverlay = (preset: CssPreset) => {
    const isGlow = radialGlowPresets.some((p) => p.id === preset.id)
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const id = createId()
    const editablePreset = createEditableCssPreset(
      preset.wrapperClassName,
      preset.innerStyle,
    )
    const overlayColor = preset.defaultColor ?? "#6366f1"
    addObject({
      id,
      type: "cssPreset",
      presetKind: isGlow ? "radialGlow" : "gradientDecoration",
      presetId: preset.name,
      cssWrapperClassName: editablePreset.wrapperClassName,
      cssStyle: editablePreset.innerStyle,
      cssBackgroundEnabled: false,
      cssBackgroundColor: "transparent",
      cssGradientLayers: recolorGradientLayers(
        editablePreset.gradientLayers,
        overlayColor,
      ),
      cssOverlayColor: overlayColor,
      cssGrain: 0,
      cssBlur: 0,
      cssOpacity: 100,
      cssRadius: 0,
      x: 60,
      y: 60,
      width: 360,
      height: 240,
      rotation: 0,
      zIndex: maxZIndex + 1,
    })
    setSelectedObjectId(id)
  }

  // Promote an image layer to the canvas background and remove the floating
  // object so it doesn't overlap the background it now provides.
  const setImageAsBackground = (image: (typeof objects)[number]) => {
    if (!image.src) return
    setBackgroundSrc(image.src)
    setBackgroundOpacity(image.imageOpacity ?? 100)
    setBackgroundType("image")
    removeObject(image.id)
  }

  const imageObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "image")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  // Auto-expand image controls when canvas selection changes.
  React.useEffect(
    () =>
      useCanvasStore.subscribe((state, previousState) => {
        const selectedId = state.selectedObjectId
        if (!selectedId || selectedId === previousState.selectedObjectId) return
        const isImage = state.objects.some(
          (object) => object.id === selectedId && object.type === "image",
        )
        if (!isImage) return
        setOpenItems((current) =>
          current.includes(selectedId) ? current : [...current, selectedId],
        )
      }),
    [],
  )

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ""
    if (files.length === 0) return
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const importedFiles = await Promise.all(files.map(importImageFileLocally))

    importedFiles.forEach((imported, index) => {
      addObject({
        id: createId(),
        type: "image",
        src: imported.src,
        imageAssetId: imported.assetId,
        imageFileName: imported.fileName,
        imageFileSize: imported.fileSize,
        imageMimeType: imported.mimeType,
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
        imageOpacity: 100,
        imageBorderRadius: 8,
      })
    })
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

          <button
            type="button"
            onClick={() => setPaperTapesOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-muted/40 border border-border/40 rounded-xl cursor-pointer hover:bg-muted transition"
          >
            <StickyNote className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Paper & Tapes</span>
          </button>

          <button
            type="button"
            onClick={() => setOverlaysOpen(true)}
            className="flex items-center justify-center gap-2 px-3 py-3 bg-muted/40 border border-border/40 rounded-xl cursor-pointer hover:bg-muted transition"
          >
            <Layers className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm">Overlays</span>
          </button>

          {backgroundType === "image" && backgroundSrc && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">Background Image</span>
              <ImagePanel />
            </div>
          )}

          {overlayObjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Overlay Layers</span>
              <div className="flex flex-col gap-2">
                {overlayObjects.map((overlay) => (
                  <CssPresetLayerControls
                    key={overlay.id}
                    object={overlay}
                    onUpdate={(updates) => updateObject(overlay.id, updates)}
                    onRemove={() => removeObject(overlay.id)}
                  />
                ))}
              </div>
            </div>
          )}

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
                              onValueChange={(value) => updateObject(image.id, { imageBlendMode: value || undefined })}
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
                          key={`image-opacity-${image.id}`}
                          defaultValue={[image.imageOpacity ?? 100]}
                          initialValue={[image.imageOpacity ?? 100]}
                          label="Opacity"
                          maxValue={100}
                          minValue={0}
                          step={1}
                          onChange={(vals) => updateObject(image.id, { imageOpacity: vals[0] })}
                        />
                        <SliderWithInput
                          key={`image-blur-${image.id}`}
                          defaultValue={[image.imageBlur ?? 0]}
                          initialValue={[image.imageBlur ?? 0]}
                          label="Blur"
                          maxValue={100}
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
                          onClick={() => setImageAsBackground(image)}
                        >
                          <ImageDown className="h-4 w-4" />
                          Set as Background
                        </Button>

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
                              imageOpacity: 100,
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

      <PaperTapesDialog open={paperTapesOpen} onOpenChange={setPaperTapesOpen} />

      <CssPresetDialog
        open={overlaysOpen}
        onOpenChange={setOverlaysOpen}
        title="Overlays"
        description="Radial glows and gradient decorations. Click one to add it as an editable layer."
        presets={OVERLAY_PRESETS}
        onUse={addOverlay}
      />
    </div>
  )
}

export default ImageAddingPanel
