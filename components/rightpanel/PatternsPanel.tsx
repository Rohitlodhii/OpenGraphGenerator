"use client"

import React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import ColorPopup from "../helpers/colorpopup"
import { CanvasObject, CanvasPatternType, useCanvasStore } from "@/store/canvasstore"
import {
  PATTERNS,
  buildPatternSvg,
  patternToDataUri,
  DEFAULT_PATTERN_COLOR,
  DEFAULT_PATTERN_SCALE,
  DEFAULT_PATTERN_OPACITY,
} from "@/lib/patterns"

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

      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-14 shrink-0">Scale</span>
        <input
          type="range"
          min={8}
          max={80}
          value={pattern.patternScale ?? DEFAULT_PATTERN_SCALE}
          onChange={(event) => onUpdate({ patternScale: Number(event.target.value) })}
          className="w-full accent-primary"
        />
        <Input
          type="number"
          value={pattern.patternScale ?? DEFAULT_PATTERN_SCALE}
          onChange={(event) => onUpdate({ patternScale: Number(event.target.value) })}
          className="h-8 w-16 text-sm"
        />
      </label>

      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="w-14 shrink-0">Opacity</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pattern.patternOpacity ?? DEFAULT_PATTERN_OPACITY}
          onChange={(event) => onUpdate({ patternOpacity: Number(event.target.value) })}
          className="w-full accent-primary"
        />
        <Input
          type="number"
          value={pattern.patternOpacity ?? DEFAULT_PATTERN_OPACITY}
          onChange={(event) => onUpdate({ patternOpacity: Number(event.target.value) })}
          className="h-8 w-16 text-sm"
        />
      </label>
    </div>
  )
}

export default PatternsPanel
