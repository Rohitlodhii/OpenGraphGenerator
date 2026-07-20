"use client"

import React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"
import { CanvasObject, CanvasPatternType, useCanvasStore } from "@/store/canvasstore"
import {
  PATTERNS,
  buildPatternSvg,
  patternToDataUri,
  DEFAULT_PATTERN_COLOR,
  DEFAULT_PATTERN_SCALE,
  DEFAULT_PATTERN_OPACITY,
} from "@/lib/patterns"
import { patternBgs, PatternBgDef } from "@/data/pattern-bgs"
import { ImportResult } from "@/lib/svg-import"
import AdditionalPatternsDialog from "./AdditionalPatternsDialog"

type PatternsPanelProps = {
  chromeless?: boolean
}

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `pattern-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const PatternsPanel = ({ chromeless = false }: PatternsPanelProps) => {
  const { objects, addObject, updateObject, removeObject } = useCanvasStore()
  const [activePattern, setActivePattern] = React.useState<CanvasPatternType>("dots")
  const [color, setColor] = React.useState(DEFAULT_PATTERN_COLOR)
  const [additionalOpen, setAdditionalOpen] = React.useState(false)

  const patternObjects = React.useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "pattern")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  const handleAddPattern = () => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    addObject({
      id: createId(),
      type: "pattern",
      x: 0,
      y: 0,
      patternType: activePattern,
      patternColor: color,
      patternScale: DEFAULT_PATTERN_SCALE,
      patternOpacity: DEFAULT_PATTERN_OPACITY,
      zIndex: maxZIndex + 1,
    })
  }

  // Additional patterns are the SVGs in /public/patternbgs, parsed through the
  // SVG import pipeline and dropped on the canvas as editable importedSvg objects.
  const addAdditionalPattern = (_pattern: PatternBgDef, result: ImportResult) => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const vb = result.viewBox
    const aspect = vb && vb.height > 0 ? vb.width / vb.height : 1
    const width = 320
    const height = Math.round(width / aspect)

    addObject({
      id: createId(),
      type: "importedSvg",
      svgTree: result.root ?? undefined,
      svgViewBox: result.viewBox,
      svgDefs: result.defs,
      x: 40,
      y: 40,
      width,
      height,
      zIndex: maxZIndex + 1,
    })
  }

  return (
    <div className={chromeless ? "flex w-full flex-col gap-3" : "flex w-full flex-col gap-3 p-1"}>
      {/* Pattern picker */}
      <div className="grid grid-cols-3 gap-2">
        {PATTERNS.map((pattern) => {
          const isActive = activePattern === pattern.type
          const thumb = buildPatternSvg(pattern.type, {
            width: 64,
            height: 64,
            size: 12,
            color: "currentColor",
          })
          return (
            <button
              key={pattern.type}
              type="button"
              onClick={() => setActivePattern(pattern.type)}
              aria-pressed={isActive}
              title={pattern.label}
              className={`flex aspect-square items-center justify-center rounded-lg border text-foreground transition-colors ${
                isActive
                  ? "border-primary bg-accent"
                  : "border-border hover:bg-accent/50"
              }`}
              style={{
                backgroundImage: patternToDataUri(thumb),
                backgroundSize: "cover",
              }}
            >
              <span className="sr-only">{pattern.label}</span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Pattern Color</span>
        <ColorPopup color={color} onChange={setColor} label="[Color]" className="bg-secondary" />
      </div>

      <Button size="sm" variant="secondary" className="h-9 w-full rounded-md text-sm" onClick={handleAddPattern}>
        <Plus className="h-4 w-4" />
        Add Pattern
      </Button>

      <div className="flex flex-col gap-2 pt-1">
        <span className="text-xs font-medium text-muted-foreground">Additional patterns</span>
        <button
          type="button"
          onClick={() => setAdditionalOpen(true)}
          className="flex h-11 w-full items-center gap-3 rounded-md border border-border bg-secondary px-2 text-left transition hover:border-primary/50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/60 p-0.5">
            {patternBgs[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={patternBgs[0].src}
                alt=""
                draggable={false}
                className="h-full w-full object-contain"
              />
            ) : null}
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-medium">Additional Patterns</span>
            <span className="text-[11px] text-muted-foreground">
              Editable pattern backgrounds
            </span>
          </span>
        </button>
      </div>

      {patternObjects.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Pattern Layers</span>
          <div className="flex flex-col gap-2">
            {patternObjects.map((pattern) => (
              <PatternLayerControls
                key={pattern.id}
                pattern={pattern}
                onUpdate={(updates) => updateObject(pattern.id, updates)}
                onRemove={() => removeObject(pattern.id)}
              />
            ))}
          </div>
        </div>
      )}

      <AdditionalPatternsDialog
        open={additionalOpen}
        onOpenChange={setAdditionalOpen}
        onUse={addAdditionalPattern}
      />
    </div>
  )
}

const PatternLayerControls = ({
  pattern,
  onUpdate,
  onRemove,
}: {
  pattern: CanvasObject
  onUpdate: (updates: Partial<CanvasObject>) => void
  onRemove: () => void
}) => {
  const label = PATTERNS.find((p) => p.type === pattern.patternType)?.label ?? "Pattern"
  return (
    <div className="flex flex-col gap-2 rounded-md border border-border bg-card p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium capitalize">{label}</span>
        <button
          type="button"
          className="text-destructive"
          onClick={onRemove}
          aria-label="Remove pattern"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <ColorPopup
        color={pattern.patternColor ?? DEFAULT_PATTERN_COLOR}
        onChange={(hex) => onUpdate({ patternColor: hex })}
        label=""
        className="bg-secondary"
      />

      <SliderWithInput
        key={`pattern-scale-${pattern.id}`}
        defaultValue={[pattern.patternScale ?? DEFAULT_PATTERN_SCALE]}
        initialValue={[pattern.patternScale ?? DEFAULT_PATTERN_SCALE]}
        label="Scale"
        minValue={8}
        maxValue={80}
        onChange={(vals) => onUpdate({ patternScale: vals[0] })}
      />

      <SliderWithInput
        key={`pattern-opacity-${pattern.id}`}
        defaultValue={[pattern.patternOpacity ?? DEFAULT_PATTERN_OPACITY]}
        initialValue={[pattern.patternOpacity ?? DEFAULT_PATTERN_OPACITY]}
        label="Opacity"
        minValue={0}
        maxValue={100}
        onChange={(vals) => onUpdate({ patternOpacity: vals[0] })}
      />
    </div>
  )
}

export default PatternsPanel
