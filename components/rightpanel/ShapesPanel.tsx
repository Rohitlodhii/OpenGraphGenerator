"use client"

import React, { useEffect, useMemo, useState } from "react"
import {
  Circle,
  GripVertical,
  Layers,
  Minus,
  Plus,
  RectangleHorizontal,
  RotateCw,
  Square,
  Trash2,
  Triangle,
} from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"
import { CanvasObject, CanvasShapeType, useCanvasStore } from "@/store/canvasstore"
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "../ui/accordion"
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { buildShapeGradientCss, SHAPE_GRADIENT_DIRECTIONS } from "@/lib/shape-gradient"
import { blobs, blobAspect, BlobDef } from "@/data/blobs"
import { motifs, MotifDef } from "@/data/motifs"
import { abstractShapes, AbstractShapeDef } from "@/data/abstract-shapes"
import { ImportResult, collectLeafParts, findNodeById, collectColorGroups, applyColorToTree } from "@/lib/svg-import"
import BlobThumb from "../previewers/BlobThumb"
import BlobsDialog from "./BlobsDialog"
import MotifsDialog from "./MotifsDialog"
import AbstractShapesDialog from "./AbstractShapesDialog"

const shapeOptions: { label: string; value: CanvasShapeType; icon: React.ReactNode }[] = [
  { label: "Rectangle", value: "rectangle", icon: <RectangleHorizontal className="h-4 w-4" /> },
  { label: "Square", value: "square", icon: <Square className="h-4 w-4" /> },
  { label: "Circle", value: "circle", icon: <Circle className="h-4 w-4" /> },
  { label: "Triangle", value: "triangle", icon: <Triangle className="h-4 w-4" /> },
  { label: "Line", value: "line", icon: <Minus className="h-4 w-4" /> },
]

const shapeDefaults: Record<CanvasShapeType, { width: number; height: number }> = {
  rectangle: { width: 220, height: 140 },
  square: { width: 160, height: 160 },
  circle: { width: 160, height: 160 },
  triangle: { width: 180, height: 160 },
  line: { width: 200, height: 4 },
}

const DEFAULT_GRADIENT_COLORS = ["#6366f1", "#ec4899"]

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `shape-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

type ShapesPanelProps = {
  isOpen?: boolean
  onToggle?: () => void
  chromeless?: boolean
}

const ShapesPanel = ({ isOpen, onToggle, chromeless = false }: ShapesPanelProps) => {
  const expanded = chromeless ? true : isOpen
  const [activeShape, setActiveShape] = useState<CanvasShapeType>("rectangle")
  const [fillColor, setFillColor] = useState("#ffffff")
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<string[]>([])
  const [blobsOpen, setBlobsOpen] = useState(false)
  const [motifsOpen, setMotifsOpen] = useState(false)
  const [abstractOpen, setAbstractOpen] = useState(false)
  const { objects, addObject, updateObject, removeObject } = useCanvasStore()
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)

  const shapeObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "shape")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  const blobObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "blob")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  const importedSvgObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "importedSvg")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  // When a shape, blob or motif is selected, expand its panel.
  useEffect(() => {
    if (!selectedObjectId) return
    const isEditable =
      shapeObjects.some((shape) => shape.id === selectedObjectId) ||
      blobObjects.some((blob) => blob.id === selectedObjectId) ||
      importedSvgObjects.some((svg) => svg.id === selectedObjectId)
    if (!isEditable) return
    setOpenItems((prev) => (prev.includes(selectedObjectId) ? prev : [...prev, selectedObjectId]))
  }, [selectedObjectId, shapeObjects, blobObjects, importedSvgObjects])

  const handleAddShape = () => {
    const defaults = shapeDefaults[activeShape]
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)

    addObject({
      id: createId(),
      type: "shape",
      shapeType: activeShape,
      fill: fillColor,
      shapeOpacity: 100,
      blur: 0,
      shapeShadow: 0,
      x: 60,
      y: 60,
      width: defaults.width,
      height: defaults.height,
      zIndex: maxZIndex + 1,
    })
  }

  const addBlob = (blob: BlobDef) => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const width = 240
    const height = Math.round(width / blobAspect(blob))

    addObject({
      id: createId(),
      type: "blob",
      blobId: blob.id,
      fill: blob.defaultColor,
      blur: 0,
      blobGrain: 0,
      x: 80,
      y: 80,
      width,
      height,
      zIndex: maxZIndex + 1,
    })
  }

  const addImportedSvg = (result: ImportResult) => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const vb = result.viewBox
    const aspect = vb && vb.height > 0 ? vb.width / vb.height : 1
    const width = 240
    const height = Math.round(width / aspect)

    addObject({
      id: createId(),
      type: "importedSvg",
      svgTree: result.root ?? undefined,
      svgViewBox: result.viewBox,
      svgDefs: result.defs,
      x: 80,
      y: 80,
      width,
      height,
      zIndex: maxZIndex + 1,
    })
  }

  const addMotif = (_motif: MotifDef, result: ImportResult) => addImportedSvg(result)
  const addAbstractShape = (_shape: AbstractShapeDef, result: ImportResult) =>
    addImportedSvg(result)

  // Update a single leaf part inside an imported SVG's tree by cloning the
  // tree, mutating the target node's style, and writing it back.
  const updateSvgPart = (
    objectId: string,
    partId: string,
    styleUpdates: Record<string, string | number | undefined>,
  ) => {
    const object = objects.find((o) => o.id === objectId)
    if (!object?.svgTree) return
    const cloned = structuredClone(object.svgTree)
    const target = findNodeById(cloned, partId)
    if (!target) return
    target.style = { ...target.style, ...styleUpdates }
    updateObject(objectId, { svgTree: cloned })
  }

  // Recolor every part (fill or stroke) that shares `oldColor` at once, so
  // identical colors behave as a single editable swatch.
  const updateSvgColor = (objectId: string, oldColor: string, newColor: string) => {
    const object = objects.find((o) => o.id === objectId)
    if (!object?.svgTree) return
    const cloned = applyColorToTree(object.svgTree, oldColor, newColor)
    updateObject(objectId, { svgTree: cloned })
  }

  const updateShapeSize = (shape: CanvasObject, direction: "inc" | "dec") => {
    const delta = direction === "inc" ? 12 : -12
    const minSize = 24
    const currentWidth = shape.width ?? shapeDefaults[shape.shapeType ?? "rectangle"].width
    const currentHeight = shape.height ?? shapeDefaults[shape.shapeType ?? "rectangle"].height

    let nextWidth = Math.max(minSize, currentWidth + delta)
    let nextHeight = Math.max(minSize, currentHeight + delta)

    if (shape.shapeType === "circle" || shape.shapeType === "square") {
      const nextSize = Math.max(minSize, (currentWidth + currentHeight) / 2 + delta)
      nextWidth = nextSize
      nextHeight = nextSize
    }

    updateObject(shape.id, { width: nextWidth, height: nextHeight })
  }

  const updateShapeNumber = (shape: CanvasObject, field: "x" | "y" | "width" | "height", value: string) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    if (field === "width" || field === "height") {
      const minSize = 24
      const normalized = Math.max(minSize, parsed)
      if (shape.shapeType === "circle" || shape.shapeType === "square") {
        updateObject(shape.id, { width: normalized, height: normalized })
        return
      }
      updateObject(shape.id, { [field]: normalized })
      return
    }
    updateObject(shape.id, { [field]: parsed })
  }

  const reorderShapes = (draggedId: string, targetId: string) => {
    if (draggedId === targetId) return

    const ids = shapeObjects.map((shape) => shape.id)
    const fromIndex = ids.indexOf(draggedId)
    const toIndex = ids.indexOf(targetId)
    if (fromIndex < 0 || toIndex < 0) return

    const reordered = [...ids]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    reordered.forEach((id, index) => {
      updateObject(id, { zIndex: reordered.length - index })
    })
  }

  const compactButton = "h-8 rounded-md px-3 text-xs"
  const compactIconButton = "h-8 w-8 rounded-md p-0 shrink-0"
  const compactInput = "h-8 w-20 rounded-md px-2 text-sm focus-visible:ring-0 focus-visible:border-input"
  const sizeInput = "h-8 w-full min-w-0 flex-1 rounded-md px-2 text-xs focus-visible:ring-0 focus-visible:border-input"

  return (
    <div
      className={
        chromeless
          ? "flex w-full flex-col "
          : "border border-border flex flex-col rounded-xl items-center overflow-hidden "
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
          <span className="text-xs font-base">Shapesss</span>
          <Layers className="h-4 w-4 text-muted-foreground" />
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
          <div className="grid grid-cols-3 gap-2">
            {shapeOptions.map((shape) => (
              <Button
                key={shape.value}
                variant={activeShape === shape.value ? "default" : "secondary"}
                size="sm"
                className="h-8 justify-start rounded-md px-3 text-xs"
                onClick={() => setActiveShape(shape.value)}
              >
                {shape.icon}
                <span>{shape.label}</span>
              </Button>
            ))}
          </div>

          <ColorPopup
            color={fillColor}
            onChange={setFillColor}
            label="[Fill]"
            className="bg-secondary"
          />

          <Button size="sm" variant="secondary" className={`w-full ${compactButton}`} onClick={handleAddShape}>
            <Plus className="h-4 w-4" />
            Add Shape
          </Button>

          <div className="flex flex-col gap-2 pt-1">
            <span className="text-xs font-medium text-muted-foreground">More shapes</span>
            <button
              type="button"
              onClick={() => setBlobsOpen(true)}
              className="flex h-11 w-full items-center gap-3 rounded-md border border-border bg-secondary px-2 text-left transition hover:border-primary/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/60 p-0.5">
                {blobs[0] ? <BlobThumb svg={blobs[0].svg} /> : null}
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-medium">Blobs</span>
                <span className="text-[11px] text-muted-foreground">
                  Organic shapes, editable
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMotifsOpen(true)}
              className="flex h-11 w-full items-center gap-3 rounded-md border border-border bg-secondary px-2 text-left transition hover:border-primary/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/60 p-0.5">
                {motifs[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={motifs[0].src}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-medium">Motifs</span>
                <span className="text-[11px] text-muted-foreground">
                  Editable decorative shapes
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setAbstractOpen(true)}
              className="flex h-11 w-full items-center gap-3 rounded-md border border-border bg-secondary px-2 text-left transition hover:border-primary/50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/60 p-0.5">
                {abstractShapes[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={abstractShapes[0].src}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-medium">Abstract Shapes</span>
                <span className="text-[11px] text-muted-foreground">
                  Editable abstract art
                </span>
              </span>
            </button>
          </div>

          {shapeObjects.length > 0 && (
            <div className="flex flex-col gap-2 ">
              <span className="text-xs text-muted-foreground font-medium">
                Shape Layers (drag to reorder)
              </span>
              <Accordion value={openItems} onValueChange={(value) => setOpenItems(value as string[])}>
                {shapeObjects.map((shape) => (
                <AccordionItem
                  key={shape.id}
                  value={shape.id}
                  className="border border-border rounded-md my-1 bg-card overflow-hidden"
                >
                  <AccordionTrigger
                    draggable
                    onDragStart={() => setDraggingId(shape.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggingId) reorderShapes(draggingId, shape.id)
                      setDraggingId(null)
                    }}
                    onDragEnd={() => setDraggingId(null)}
                    className="w-full h-8 px-2 flex items-center justify-between gap-2 py-0 text-xs text-muted-foreground [&_[data-slot=accordion-indicator]]:hidden"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="text-xs capitalize text-muted-foreground">
                        {shape.shapeType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-sm border border-border"
                        style={{
                          background:
                            shape.shapeFillMode === "gradient"
                              ? buildShapeGradientCss(
                                  shape.shapeGradientDirection ?? "to-b",
                                  shape.shapeGradientColors ?? DEFAULT_GRADIENT_COLORS,
                                )
                              : shape.fill ?? "#ffffff",
                        }}
                      />
                      <div
                        role="button"
                        tabIndex={0}
                        className={`${compactIconButton} text-destructive flex items-center justify-center`}
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          removeObject(shape.id)
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault()
                            event.stopPropagation()
                            removeObject(shape.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionPanel className="pb-0 border-t border-border">
                    <div className="flex flex-col gap-1.5 p-2">
                      <span className="text-[11px] font-medium  tracking-wide text-muted-foreground">
                        Fill
                      </span>
                      <ToggleGroup
                        variant="outline"
                        value={[shape.shapeFillMode ?? "solid"]}
                        onValueChange={(v: string[]) => {
                          if (v[0]) updateObject(shape.id, { shapeFillMode: v[0] as "solid" | "gradient" })
                        }}
                        className="w-full *:flex-1"
                      >
                        <ToggleGroupItem value="solid">Solid</ToggleGroupItem>
                        <ToggleGroupItem value="gradient">Gradient</ToggleGroupItem>
                      </ToggleGroup>

                      {shape.shapeFillMode === "gradient" ? (
                        <>
                          <div className="flex flex-col gap-2">
                            {(shape.shapeGradientColors ?? DEFAULT_GRADIENT_COLORS).map((color, index, colors) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="flex-1">
                                  <ColorPopup
                                    color={color}
                                    onChange={(hex) => {
                                      const next = [...colors]
                                      next[index] = hex
                                      updateObject(shape.id, { shapeGradientColors: next })
                                    }}
                                    label=""
                                    className="bg-secondary"
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="shrink-0 text-destructive disabled:pointer-events-none disabled:opacity-30"
                                  disabled={colors.length <= 2}
                                  aria-label="Remove color"
                                  onClick={() =>
                                    updateObject(shape.id, {
                                      shapeGradientColors: colors.filter((_, i) => i !== index),
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}

                            {(shape.shapeGradientColors ?? DEFAULT_GRADIENT_COLORS).length < 3 && (
                              <button
                                type="button"
                                className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                                onClick={() => {
                                  const colors = shape.shapeGradientColors ?? DEFAULT_GRADIENT_COLORS
                                  updateObject(shape.id, {
                                    shapeGradientColors: [...colors, "#22d3ee"],
                                  })
                                }}
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add color
                              </button>
                            )}
                          </div>
                          <Select
                            value={shape.shapeGradientDirection ?? "to-b"}
                            onValueChange={(value) =>
                              updateObject(shape.id, { shapeGradientDirection: value as CanvasObject["shapeGradientDirection"] })
                            }
                          >
                            <SelectTrigger size="sm" className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectPopup>
                              {SHAPE_GRADIENT_DIRECTIONS.map((direction) => (
                                <SelectItem key={direction.value} value={direction.value}>
                                  {direction.label}
                                </SelectItem>
                              ))}
                            </SelectPopup>
                          </Select>
                        </>
                      ) : (
                        <ColorPopup
                          color={shape.fill ?? "#ffffff"}
                          onChange={(hex) => updateObject(shape.id, { fill: hex })}
                          label=""
                          className=""
                        />
                      )}

                      <span className="mt-1 text-[11px] font-medium  tracking-wide text-muted-foreground">
                        Positioning
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex h-8 items-center gap-2 rounded-md border border-border px-2">
                          <span className="text-xs font-medium text-muted-foreground">X</span>
                          <input
                            type="number"
                            value={Math.round(shape.x)}
                            onChange={(event) => updateShapeNumber(shape, "x", event.target.value)}
                            className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </div>
                        <div className="flex h-8 items-center gap-2 rounded-md border border-border px-2">
                          <span className="text-xs font-medium text-muted-foreground">Y</span>
                          <input
                            type="number"
                            value={Math.round(shape.y)}
                            onChange={(event) => updateShapeNumber(shape, "y", event.target.value)}
                            className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          />
                        </div>
                      </div>

                      <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Size
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button variant="secondary" size="sm" className={compactIconButton} onClick={() => updateShapeSize(shape, "dec")}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground shrink-0">W</span>
                        <Input
                          type="number"
                          value={Math.round(shape.width ?? 0)}
                          onChange={(event) => updateShapeNumber(shape, "width", event.target.value)}
                          className={sizeInput}
                        />
                        <span className="text-xs text-muted-foreground shrink-0">H</span>
                        <Input
                          type="number"
                          value={Math.round(shape.height ?? 0)}
                          onChange={(event) => updateShapeNumber(shape, "height", event.target.value)}
                          className={sizeInput}
                        />
                        <Button variant="secondary" size="sm" className={compactIconButton} onClick={() => updateShapeSize(shape, "inc")}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-8 w-8 shrink-0 rounded-md border border-input bg-secondary flex items-center justify-center">
                          <RotateCw className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <Input
                          type="number"
                          value={Math.round(shape.rotation ?? 0)}
                          onChange={(event) => {
                            const parsed = Number(event.target.value)
                            if (Number.isNaN(parsed)) return
                            updateObject(shape.id, { rotation: parsed })
                          }}
                          className={`${sizeInput} flex-1`}
                        />
                        <span className="text-xs text-muted-foreground shrink-0">deg</span>
                      </div>

                      <SliderWithInput
                        key={`shape-opacity-${shape.id}`}
                        defaultValue={[shape.shapeOpacity ?? 100]}
                        initialValue={[shape.shapeOpacity ?? 100]}
                        label="Opacity"
                        maxValue={100}
                        minValue={0}
                        onChange={(vals) => updateObject(shape.id, { shapeOpacity: vals[0] })}
                      />

                      <SliderWithInput
                        key={`shape-blur-${shape.id}`}
                        defaultValue={[shape.blur ?? 0]}
                        initialValue={[shape.blur ?? 0]}
                        label="Blur"
                        maxValue={40}
                        minValue={0}
                        onChange={(vals) => updateObject(shape.id, { blur: vals[0] })}
                      />

                      {shape.shapeType !== "circle" && shape.shapeType !== "triangle" && (
                        <SliderWithInput
                          key={`shape-radius-${shape.id}`}
                          defaultValue={[shape.shapeBorderRadius ?? 0]}
                          initialValue={[shape.shapeBorderRadius ?? 0]}
                          label="Radius"
                          maxValue={200}
                          minValue={0}
                          onChange={(vals) => updateObject(shape.id, { shapeBorderRadius: vals[0] })}
                        />
                      )}

                      <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Stroke
                      </span>
                      {!shape.strokeColor ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className={compactButton}
                          onClick={() =>
                            updateObject(shape.id, {
                              strokeColor: "#111111",
                              strokeWidth: 2,
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add Stroke
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <ColorPopup
                            color={shape.strokeColor}
                            onChange={(hex) => updateObject(shape.id, { strokeColor: hex })}
                            label="[Stroke]"
                            className="bg-secondary"
                          />
                          <SliderWithInput
                            key={`shape-stroke-width-${shape.id}`}
                            defaultValue={[shape.strokeWidth ?? 2]}
                            initialValue={[shape.strokeWidth ?? 2]}
                            label="Stroke"
                            maxValue={50}
                            minValue={1}
                            onChange={(vals) =>
                              updateObject(shape.id, {
                                strokeWidth: vals[0],
                              })
                            }
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className={`${compactButton} text-destructive`}
                            onClick={() =>
                              updateObject(shape.id, {
                                strokeColor: undefined,
                                strokeWidth: undefined,
                              })
                            }
                          >
                            Remove Stroke
                          </Button>
                        </div>
                      )}

                      <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                        Shadow
                      </span>
                      {!shape.shapeShadowColor ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          className={compactButton}
                          onClick={() =>
                            updateObject(shape.id, {
                              shapeShadowColor: "#000000",
                              shapeShadow: 10,
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                          Add Shadow
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <ColorPopup
                            color={shape.shapeShadowColor}
                            onChange={(hex) => updateObject(shape.id, { shapeShadowColor: hex })}
                            label="[Shadow]"
                            className="bg-secondary"
                          />
                          <SliderWithInput
                            key={`shape-shadow-${shape.id}`}
                            defaultValue={[shape.shapeShadow ?? 0]}
                            initialValue={[shape.shapeShadow ?? 0]}
                            label="Shadow"
                            maxValue={100}
                            minValue={0}
                            onChange={(vals) => updateObject(shape.id, { shapeShadow: vals[0] })}
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            className={`${compactButton} text-destructive`}
                            onClick={() =>
                              updateObject(shape.id, {
                                shapeShadowColor: undefined,
                                shapeShadow: 0,
                              })
                            }
                          >
                            Remove Shadow
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionPanel>
                </AccordionItem>
              ))}
              </Accordion>
            </div>
          )}

          {blobObjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Blobs</span>
              <Accordion value={openItems} onValueChange={(value) => setOpenItems(value as string[])}>
                {blobObjects.map((blob) => {
                  const def = blobs.find((b) => b.id === blob.blobId)
                  return (
                    <AccordionItem
                      key={blob.id}
                      value={blob.id}
                      className="border border-border rounded-md my-1 bg-card overflow-hidden"
                    >
                      <AccordionTrigger className="w-full h-8 px-2 flex items-center justify-between gap-2 py-0 text-xs text-muted-foreground [&_[data-slot=accordion-indicator]]:hidden">
                        <div className="flex items-center gap-2">
                          <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-sm">
                            {def ? <BlobThumb svg={def.svg} /> : null}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {def?.name ?? "Blob"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-sm border border-border"
                            style={{ backgroundColor: blob.fill ?? "#ffffff" }}
                          />
                          <div
                            role="button"
                            tabIndex={0}
                            className={`${compactIconButton} text-destructive flex items-center justify-center`}
                            onClick={(event) => {
                              event.preventDefault()
                              event.stopPropagation()
                              removeObject(blob.id)
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault()
                                event.stopPropagation()
                                removeObject(blob.id)
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionPanel className="pb-0 border-t border-border">
                        <div className="flex flex-col gap-1.5 p-2">
                          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                            Color
                          </span>
                          <ColorPopup
                            color={blob.fill ?? def?.defaultColor ?? "#ffffff"}
                            onChange={(hex) => updateObject(blob.id, { fill: hex })}
                            label=""
                            className=""
                          />

                          <SliderWithInput
                            key={`blob-blur-${blob.id}`}
                            defaultValue={[blob.blur ?? 0]}
                            initialValue={[blob.blur ?? 0]}
                            label="Blur"
                            maxValue={40}
                            minValue={0}
                            onChange={(vals) => updateObject(blob.id, { blur: vals[0] })}
                          />

                          <SliderWithInput
                            key={`blob-grain-${blob.id}`}
                            defaultValue={[blob.blobGrain ?? 0]}
                            initialValue={[blob.blobGrain ?? 0]}
                            label="Grain"
                            maxValue={100}
                            minValue={0}
                            onChange={(vals) => updateObject(blob.id, { blobGrain: vals[0] })}
                          />

                          <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            Rotation
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 shrink-0 rounded-md border border-input bg-secondary flex items-center justify-center">
                              <RotateCw className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                              type="number"
                              value={Math.round(blob.rotation ?? 0)}
                              onChange={(event) => {
                                const parsed = Number(event.target.value)
                                if (Number.isNaN(parsed)) return
                                updateObject(blob.id, { rotation: parsed })
                              }}
                              className={`${sizeInput} flex-1`}
                            />
                            <span className="text-xs text-muted-foreground shrink-0">deg</span>
                          </div>
                        </div>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          )}

          {importedSvgObjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Motifs</span>
              <Accordion value={openItems} onValueChange={(value) => setOpenItems(value as string[])}>
                {importedSvgObjects.map((svg) => {
                  const parts = svg.svgTree ? collectLeafParts(svg.svgTree) : []
                  const colorGroups = svg.svgTree ? collectColorGroups(svg.svgTree) : []
                  return (
                    <AccordionItem
                      key={svg.id}
                      value={svg.id}
                      className="border border-border rounded-md my-1 bg-card overflow-hidden"
                    >
                      <AccordionTrigger className="w-full h-8 px-2 flex items-center justify-between gap-2 py-0 text-xs text-muted-foreground [&_[data-slot=accordion-indicator]]:hidden">
                        <span className="text-xs text-muted-foreground truncate">
                          {svg.svgTree?.name ?? "SVG"} · {parts.length} parts · {colorGroups.length} colors
                        </span>
                        <div
                          role="button"
                          tabIndex={0}
                          className={`${compactIconButton} text-destructive flex items-center justify-center`}
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            removeObject(svg.id)
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault()
                              event.stopPropagation()
                              removeObject(svg.id)
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </div>
                      </AccordionTrigger>

                      <AccordionPanel className="pb-0 border-t border-border">
                        <div className="flex flex-col gap-3 p-2">
                          <div className="flex flex-col gap-1.5 border-b border-border/60 pb-2">
                            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              Rotation
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 shrink-0 rounded-md border border-input bg-secondary flex items-center justify-center">
                                <RotateCw className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Input
                                type="number"
                                value={Math.round(svg.rotation ?? 0)}
                                onChange={(event) => {
                                  const parsed = Number(event.target.value)
                                  if (Number.isNaN(parsed)) return
                                  updateObject(svg.id, { rotation: parsed })
                                }}
                                className={`${sizeInput} flex-1`}
                              />
                              <span className="text-xs text-muted-foreground shrink-0">deg</span>
                            </div>
                          </div>
                          {/* Deduplicated colors: identical fills/strokes share one
                              swatch, so editing recolors every matching part at once. */}
                          {colorGroups.length > 0 && (
                            <div className="flex flex-col gap-1.5 border-b border-border/60 pb-2">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                Colors
                              </span>
                              {colorGroups.map((group) => (
                                <ColorPopup
                                  key={group.color}
                                  color={group.color.slice(0, 7)}
                                  onChange={(hex) => updateSvgColor(svg.id, group.color, hex)}
                                  label={`${group.usages.length} part${group.usages.length > 1 ? "s" : ""}`}
                                  className="bg-secondary"
                                />
                              ))}
                            </div>
                          )}

                          {/* Per-part opacity stays per-part. */}
                          {parts.map((part, idx) => (
                            <div
                              key={part.id}
                              className="flex flex-col gap-1.5 border-b border-border/60 pb-2 last:border-b-0 last:pb-0"
                            >
                              <span className="text-[11px] font-medium text-muted-foreground">
                                {part.name ?? `${part.type} ${idx + 1}`}
                              </span>
                              <SliderWithInput
                                key={`svgpart-op-${part.id}`}
                                defaultValue={[Math.round((part.opacity ?? 1) * 100)]}
                                initialValue={[Math.round((part.opacity ?? 1) * 100)]}
                                label="Opacity"
                                maxValue={100}
                                minValue={0}
                                onChange={(vals) =>
                                  updateSvgPart(svg.id, part.id, { fillOpacity: vals[0] / 100 })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionPanel>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          )}
        </div>
      </div>

      <BlobsDialog open={blobsOpen} onOpenChange={setBlobsOpen} onUse={addBlob} />
      <MotifsDialog open={motifsOpen} onOpenChange={setMotifsOpen} onUse={addMotif} />
      <AbstractShapesDialog
        open={abstractOpen}
        onOpenChange={setAbstractOpen}
        onUse={addAbstractShape}
      />
    </div>
  )
}

export default ShapesPanel
