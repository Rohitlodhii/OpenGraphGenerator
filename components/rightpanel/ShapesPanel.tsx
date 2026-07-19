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

const shapeOptions: { label: string; value: CanvasShapeType; icon: React.ReactNode }[] = [
  { label: "Rectangle", value: "rectangle", icon: <RectangleHorizontal className="h-4 w-4" /> },
  { label: "Square", value: "square", icon: <Square className="h-4 w-4" /> },
  { label: "Circle", value: "circle", icon: <Circle className="h-4 w-4" /> },
  { label: "Triangle", value: "triangle", icon: <Triangle className="h-4 w-4" /> },
]

const shapeDefaults: Record<CanvasShapeType, { width: number; height: number }> = {
  rectangle: { width: 220, height: 140 },
  square: { width: 160, height: 160 },
  circle: { width: 160, height: 160 },
  triangle: { width: 180, height: 160 },
}

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
  const { objects, addObject, updateObject, removeObject } = useCanvasStore()
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)

  const shapeObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "shape")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  // When a shape is selected on the canvas, expand its accordion panel.
  useEffect(() => {
    if (!selectedObjectId) return
    const isShape = shapeObjects.some((shape) => shape.id === selectedObjectId)
    if (!isShape) return
    setOpenItems((prev) => (prev.includes(selectedObjectId) ? prev : [...prev, selectedObjectId]))
  }, [selectedObjectId, shapeObjects])

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
          <div className="grid grid-cols-2 gap-2">
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
                        style={{ backgroundColor: shape.fill ?? "#ffffff" }}
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
                        Background Color
                      </span>
                      <ColorPopup
                        color={shape.fill ?? "#ffffff"}
                        onChange={(hex) => updateObject(shape.id, { fill: hex })}
                        label=""
                        className=""
                      />

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
                        <Button variant="secondary" size="sm" className={compactIconButton} onClick={() => updateShapeSize(shape, "inc")}>
                          <Plus className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  )
}

export default ShapesPanel
