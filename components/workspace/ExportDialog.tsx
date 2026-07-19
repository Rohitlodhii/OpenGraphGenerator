"use client"

import React from "react"
import { Download } from "lucide-react"
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
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toPng, toJpeg, toSvg } from "html-to-image"
import { useCanvasStore } from "@/store/canvasstore"

type Format = "png" | "jpeg" | "svg"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SCALES = [1, 2, 3] as const

const ExportDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [format, setFormat] = React.useState<Format>("png")
  const [quality, setQuality] = React.useState(92)
  const [scale, setScale] = React.useState<number>(2)
  const [isExporting, setIsExporting] = React.useState(false)

  const selectedObjectId = useCanvasStore((s) => s.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((s) => s.setSelectedObjectId)

  const isRaster = format !== "svg"

  const handleExport = async () => {
    const stage = document.querySelector(".canvas-stage") as HTMLElement | null
    if (!stage || isExporting) return

    const previousSelected = selectedObjectId
    try {
      setIsExporting(true)
      setSelectedObjectId(null)

      await new Promise<void>((r) => requestAnimationFrame(() => r()))
      await new Promise<void>((r) => requestAnimationFrame(() => r()))

      let dataUrl: string
      if (format === "png") {
        dataUrl = await toPng(stage, { cacheBust: true, pixelRatio: scale })
      } else if (format === "jpeg") {
        dataUrl = await toJpeg(stage, {
          cacheBust: true,
          pixelRatio: scale,
          quality: quality / 100,
          backgroundColor: "#ffffff",
        })
      } else {
        dataUrl = await toSvg(stage, { cacheBust: true })
      }

      const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `preview-${stamp}.${format === "jpeg" ? "jpg" : format}`
      link.click()

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to export:", error)
    } finally {
      setIsExporting(false)
      setSelectedObjectId(previousSelected)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export image</DialogTitle>
          <DialogDescription>
            Choose a format and quality, then download your canvas.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Format</Label>
            <ToggleGroup
              variant="outline"
              value={[format]}
              onValueChange={(v: string[]) => {
                if (v[0]) setFormat(v[0] as Format)
              }}
              className="w-full *:flex-1"
            >
              <ToggleGroupItem value="png">PNG</ToggleGroupItem>
              <ToggleGroupItem value="jpeg">JPEG</ToggleGroupItem>
              <ToggleGroupItem value="svg">SVG</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {isRaster && (
            <div className="flex flex-col gap-2">
              <Label>Scale</Label>
              <ToggleGroup
                variant="outline"
                value={[String(scale)]}
                onValueChange={(v: string[]) => {
                  if (v[0]) setScale(Number(v[0]))
                }}
                className="w-full *:flex-1"
              >
                {SCALES.map((s) => (
                  <ToggleGroupItem key={s} value={String(s)}>
                    {s}x
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          {format === "jpeg" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {quality}%
                </span>
              </div>
              <Slider
                min={10}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={(v) => setQuality(v[0])}
              />
            </div>
          )}
        </DialogPanel>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting} className="gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export default ExportDialog
