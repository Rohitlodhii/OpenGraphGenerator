"use client"

import React, { useEffect, useState } from "react"
import {
  Popover,
  PopoverDescription,
  PopoverPopup,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { Proportions } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DimensionPresets } from "@/data/dimensionpresets"
import useDimensionStore from "@/hooks/dimension"

const DimensionSelector = () => {
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
    <Popover>
      {/* Proper Trigger */}
      <PopoverTrigger>
        <Card className="h-14 cursor-pointer rounded-none p-2 flex items-center justify-center">
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex gap-2 items-center">
              <Proportions className="h-4 w-4" />
              <span>Dimensions</span>
            </div>
            <span className="text-muted-foreground text-xs">
              {width} × {height}
            </span>
          </div>
        </Card>
      </PopoverTrigger>

      {/* Popup */}
      <PopoverPopup className="w-80 space-y-6" side="bottom" align="center">

        <PopoverTitle className="text-sm hidden font-semibold">
          Change Dimensions
        </PopoverTitle>

        <PopoverDescription className="space-y-6">

          {/* Custom */}
          <div className="space-y-3 flex flex-col gap-1">
            <span className="text-sm font-medium">Custom</span>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Width"
                value={w}
                onChange={(e) => setW(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Height"
                value={h}
                onChange={(e) => setH(e.target.value)}
              />
              <Button size="sm" onClick={apply}>
                Apply
              </Button>
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-3 flex flex-col gap-1">
            <span className="text-sm font-medium">Presets</span>

            <div className="grid grid-cols-2 gap-2">
              {DimensionPresets.map((item) => {
                const isActive =
                  width === item.width && height === item.height

                return (
                  <Card
                    key={item.id}
                    onClick={() =>
                      setDimensions({
                        width: item.width,
                        height: item.height,
                      })
                    }
                    className={`p-3 rounded-xl flex gap-2 items-center justify-center cursor-pointer transition
                      ${
                        isActive
                          ? "border-primary bg-muted"
                          : "hover:bg-muted/50"
                      }
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-xs">
                      {item.width} × {item.height}
                    </span>
                  </Card>
                )
              })}
            </div>
          </div>

        </PopoverDescription>
      </PopoverPopup>
    </Popover>
  )
}

export default DimensionSelector