"use client"

import React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"
import { useCustomGradientStore } from "@/store/customgradientstore"

const CustomGradientPanel = () => {
  const mode = useCustomGradientStore((s) => s.mode)
  const angle = useCustomGradientStore((s) => s.angle)
  const radialShape = useCustomGradientStore((s) => s.radialShape)
  const stops = useCustomGradientStore((s) => s.stops)
  const grain = useCustomGradientStore((s) => s.grain)
  const setMode = useCustomGradientStore((s) => s.setMode)
  const setAngle = useCustomGradientStore((s) => s.setAngle)
  const setRadialShape = useCustomGradientStore((s) => s.setRadialShape)
  const setGrain = useCustomGradientStore((s) => s.setGrain)
  const addStop = useCustomGradientStore((s) => s.addStop)
  const removeStop = useCustomGradientStore((s) => s.removeStop)
  const updateStop = useCustomGradientStore((s) => s.updateStop)

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Type</Label>
        <ToggleGroup
          variant="outline"
          value={[mode]}
          onValueChange={(v: string[]) => {
            if (v[0]) setMode(v[0] as "linear" | "radial")
          }}
          className="w-full *:flex-1"
        >
          <ToggleGroupItem value="linear">Linear</ToggleGroupItem>
          <ToggleGroupItem value="radial">Radial</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {mode === "linear" ? (
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Direction</Label>
          <SliderWithInput
            key={`angle-${angle}`}
            defaultValue={[angle]}
            initialValue={[angle]}
            label="Angle"
            minValue={0}
            maxValue={360}
            onChange={(vals) => setAngle(vals[0])}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-medium text-muted-foreground">Shape</Label>
          <ToggleGroup
            variant="outline"
            value={[radialShape]}
            onValueChange={(v: string[]) => {
              if (v[0]) setRadialShape(v[0] as "circle" | "ellipse")
            }}
            className="w-full *:flex-1"
          >
            <ToggleGroupItem value="circle">Circle</ToggleGroupItem>
            <ToggleGroupItem value="ellipse">Ellipse</ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium text-muted-foreground">Colors</Label>
          <Button size="sm" variant="secondary" className="h-7 rounded-md px-2 text-xs" onClick={addStop}>
            <Plus className="h-3.5 w-3.5" />
            Add stop
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {stops.map((stop) => (
            <div key={stop.id} className="flex flex-col gap-2 rounded-md border border-border bg-card p-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <ColorPopup
                    color={stop.color}
                    onChange={(hex) => updateStop(stop.id, { color: hex })}
                    label=""
                    className="bg-secondary"
                  />
                </div>
                <button
                  type="button"
                  className="shrink-0 text-destructive disabled:opacity-40"
                  disabled={stops.length <= 2}
                  aria-label="Remove color stop"
                  onClick={() => removeStop(stop.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <SliderWithInput
                key={`position-${stop.id}-${stop.position}`}
                defaultValue={[stop.position]}
                initialValue={[stop.position]}
                label="Position"
                minValue={0}
                maxValue={100}
                onChange={(vals) => updateStop(stop.id, { position: vals[0] })}
              />
              <SliderWithInput
                key={`opacity-${stop.id}-${stop.opacity}`}
                defaultValue={[stop.opacity]}
                initialValue={[stop.opacity]}
                label="Opacity"
                minValue={0}
                maxValue={100}
                onChange={(vals) => updateStop(stop.id, { opacity: vals[0] })}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Grain</Label>
        <SliderWithInput
          key={`grain-${grain}`}
          defaultValue={[grain]}
          initialValue={[grain]}
          label="Grain"
          minValue={0}
          maxValue={100}
          onChange={(vals) => setGrain(vals[0])}
        />
      </div>
    </div>
  )
}

export default CustomGradientPanel
