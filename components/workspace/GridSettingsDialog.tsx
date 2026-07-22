"use client"

import React from "react"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import ColorPopup from "@/components/helpers/colorpopup"
import SliderWithInput from "@/components/helpers/SliderWithInput"
import { useGridStore } from "@/store/gridstore"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GridSettingsDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const gridLines = useGridStore((s) => s.gridLines)
  const gridColor = useGridStore((s) => s.gridColor)
  const gridOpacity = useGridStore((s) => s.gridOpacity)
  const setGridLines = useGridStore((s) => s.setGridLines)
  const setGridColor = useGridStore((s) => s.setGridColor)
  const setGridOpacity = useGridStore((s) => s.setGridOpacity)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Grid settings</DialogTitle>
          <DialogDescription>
            Alignment guide only — never appears in exported images.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Lines</Label>
            <SliderWithInput
              key={`grid-lines-${gridLines}`}
              defaultValue={[gridLines]}
              initialValue={[gridLines]}
              label="Lines"
              minValue={2}
              maxValue={24}
              onChange={(vals) => setGridLines(vals[0])}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Color</Label>
            <ColorPopup color={gridColor} onChange={setGridColor} label="[Color]" className="bg-secondary" />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Opacity</Label>
            <SliderWithInput
              key={`grid-opacity-${gridOpacity}`}
              defaultValue={[gridOpacity]}
              initialValue={[gridOpacity]}
              label="Opacity"
              minValue={0}
              maxValue={100}
              onChange={(vals) => setGridOpacity(vals[0])}
            />
          </div>
        </DialogPanel>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export default GridSettingsDialog
