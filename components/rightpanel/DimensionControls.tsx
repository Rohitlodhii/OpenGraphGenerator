"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DimensionPresets } from "@/data/dimensionpresets"
import useDimensionStore from "@/hooks/dimension"

// Body-only dimension controls (custom size + presets), used inside the
// left sidebar "Size" tab.
export const DimensionControls = () => {
  const width = useDimensionStore((s) => s.width)
  const height = useDimensionStore((s) => s.height)
  const setDimensions = useDimensionStore((s) => s.setDimensions)

  const [w, setW] = useState(width.toString())
  const [h, setH] = useState(height.toString())

  useEffect(() => {
    setW(width.toString())
    setH(height.toString())
  }, [width, height])

  const apply = () => {
    const parsedW = Math.max(1, Math.round(Number(w) || 0))
    const parsedH = Math.max(1, Math.round(Number(h) || 0))
    setDimensions({ width: parsedW, height: parsedH })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Custom */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Custom</span>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Width"
            value={w}
            onChange={(e) => setW(e.target.value)}
            className="h-10 text-sm"
          />
          <Input
            type="number"
            placeholder="Height"
            value={h}
            onChange={(e) => setH(e.target.value)}
            className="h-10 text-sm"
          />
          <Button className="h-10 px-4" onClick={apply}>
            Apply
          </Button>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Presets</span>
        <div className="grid grid-cols-2 gap-2">
          {DimensionPresets.map((item) => {
            const isActive = width === item.width && height === item.height
            return (
              <Card
                key={item.id}
                onClick={() =>
                  setDimensions({ width: item.width, height: item.height })
                }
                className={`p-4 rounded-xl flex gap-2 items-center justify-center cursor-pointer transition
                  ${isActive ? "border-primary bg-muted" : "hover:bg-muted/50"}
                `}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm">
                  {item.width} × {item.height}
                </span>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DimensionControls
