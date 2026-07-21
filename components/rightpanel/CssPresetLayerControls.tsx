"use client"

import React from "react"
import { RotateCw, Trash2 } from "lucide-react"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"
import { Input } from "../ui/input"
import type { CanvasObject } from "@/store/canvasstore"
import {
  createEditableCssPreset,
  recolorGradientLayers,
} from "@/lib/css-presets"

const compactInput =
  "h-8 w-full min-w-0 px-2 text-xs focus-visible:border-input focus-visible:ring-0"

const CssPresetLayerControls = ({
  object,
  onUpdate,
  onRemove,
}: {
  object: CanvasObject
  onUpdate: (updates: Partial<CanvasObject>) => void
  onRemove: () => void
}) => {
  const fallbackPreset = React.useMemo(
    () =>
      createEditableCssPreset(
        object.cssWrapperClassName ?? "",
        object.cssStyle ?? {},
      ),
    [object.cssStyle, object.cssWrapperClassName],
  )
  const layers = object.cssGradientLayers ?? fallbackPreset.gradientLayers
  const fallbackColor =
    layers
      .flatMap((layer) => layer.stops)
      .find((stop) => stop.opacity > 0)?.color ?? "#6366f1"
  const overlayColor = object.cssOverlayColor ?? fallbackColor

  const ensureEditable = (updates: Partial<CanvasObject>) => {
    onUpdate({
      cssWrapperClassName:
        object.cssGradientLayers === undefined
          ? fallbackPreset.wrapperClassName
          : object.cssWrapperClassName,
      cssStyle:
        object.cssGradientLayers === undefined
          ? fallbackPreset.innerStyle
          : object.cssStyle,
      cssBackgroundEnabled: false,
      cssBackgroundColor: "transparent",
      cssGradientLayers: layers,
      cssOverlayColor: overlayColor,
      ...updates,
    })
  }

  const updateNumber = (
    field: "x" | "y" | "width" | "height" | "rotation",
    value: string,
  ) => {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return
    const nextValue =
      field === "width" || field === "height" ? Math.max(24, parsed) : parsed
    ensureEditable({ [field]: nextValue })
  }

  const updateColor = (color: string) => {
    ensureEditable({
      cssOverlayColor: color,
      cssGradientLayers: recolorGradientLayers(layers, color),
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium">
          {object.presetId ?? "Overlay"}
        </span>
        <button
          type="button"
          className="rounded-md p-1 text-destructive transition-colors hover:bg-destructive/10"
          onClick={onRemove}
          aria-label="Remove overlay"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ColorPopup
        color={overlayColor}
        onChange={updateColor}
        label="[Color]"
        className="bg-secondary"
      />

      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Position
      </span>
      <div className="grid grid-cols-2 gap-2">
        <NumberControl
          label="X"
          value={object.x}
          onChange={(value) => updateNumber("x", value)}
        />
        <NumberControl
          label="Y"
          value={object.y}
          onChange={(value) => updateNumber("y", value)}
        />
      </div>

      <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Size
      </span>
      <div className="grid grid-cols-2 gap-2">
        <NumberControl
          label="W"
          value={object.width ?? 360}
          min={24}
          onChange={(value) => updateNumber("width", value)}
        />
        <NumberControl
          label="H"
          value={object.height ?? 240}
          min={24}
          onChange={(value) => updateNumber("height", value)}
        />
      </div>

      <label className="mt-1 flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-input bg-secondary">
          <RotateCw className="h-4 w-4 text-muted-foreground" />
        </span>
        <Input
          type="number"
          value={Math.round(object.rotation ?? 0)}
          onChange={(event) => updateNumber("rotation", event.target.value)}
          className={`${compactInput} flex-1`}
        />
        <span className="shrink-0 text-xs text-muted-foreground">deg</span>
      </label>

      <SliderWithInput
        key={`css-opacity-${object.id}`}
        defaultValue={[object.cssOpacity ?? 100]}
        initialValue={[object.cssOpacity ?? 100]}
        label="Opacity"
        minValue={0}
        maxValue={100}
        step={1}
        onChange={(values) => ensureEditable({ cssOpacity: values[0] })}
      />

      <SliderWithInput
        key={`css-blur-${object.id}`}
        defaultValue={[object.cssBlur ?? 0]}
        initialValue={[object.cssBlur ?? 0]}
        label="Blur"
        minValue={0}
        maxValue={100}
        step={1}
        onChange={(values) => ensureEditable({ cssBlur: values[0] })}
      />

      <SliderWithInput
        key={`css-grain-${object.id}`}
        defaultValue={[object.cssGrain ?? 0]}
        initialValue={[object.cssGrain ?? 0]}
        label="Grain"
        minValue={0}
        maxValue={100}
        step={1}
        onChange={(values) => ensureEditable({ cssGrain: values[0] })}
      />
    </div>
  )
}

const NumberControl = ({
  label,
  value,
  min,
  onChange,
}: {
  label: string
  value: number
  min?: number
  onChange: (value: string) => void
}) => (
  <label className="flex h-8 items-center gap-2 rounded-md border border-input bg-background px-2">
    <span className="shrink-0 text-xs font-medium text-muted-foreground">
      {label}
    </span>
    <input
      type="number"
      min={min}
      value={Math.round(value)}
      onChange={(event) => onChange(event.target.value)}
      className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    />
  </label>
)

export default CssPresetLayerControls
