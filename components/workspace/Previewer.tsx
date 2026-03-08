"use client"

import React, { useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import useDimensionStore from "@/hooks/dimension"
import Stage from "./Stage"
import BackgroundRenderer from "./BackgroundRenderer"
import ObjectsLayer from "./ObjectsLayer"
import { toPng } from "html-to-image"
import { useCanvasStore } from "@/store/canvasstore"

const Previewer = () => {
  const [zoom, setZoom] = useState(70)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const width = useDimensionStore((s) => s.width)
  const height = useDimensionStore((s) => s.height)
  const selectedObjectId = useCanvasStore((s) => s.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((s) => s.setSelectedObjectId)

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 200))
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 25))
  const resetZoom = () => setZoom(100)

  const toggleFullscreen = () => setIsFullscreen((p) => !p)

  const handleExportImage = async () => {
    const stage = document.querySelector(".canvas-stage") as HTMLElement | null
    if (!stage || isExporting) return

    const previousSelected = selectedObjectId
    try {
      setIsExporting(true)
      setSelectedObjectId(null)

      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

      const dataUrl = await toPng(stage, {
        cacheBust: true,
        pixelRatio: 2,
      })

      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `preview-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")}.png`
      link.click()
    } catch (error) {
      console.error("Failed to export preview image:", error)
    } finally {
      setIsExporting(false)
      setSelectedObjectId(previousSelected)
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-pattern relative">

      {/* Preview Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <Stage width={width} height={height} zoom={zoom}>
          <BackgroundRenderer width={width} height={height} />
          <ObjectsLayer zoom={zoom} />
        </Stage>
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card rounded-full px-4 py-3 shadow-lg border">

        <Button onClick={zoomOut} disabled={zoom <= 25} variant="ghost" size="sm">
          <ZoomOut className="w-4 h-4" />
        </Button>

        <Button onClick={resetZoom} variant="ghost" size="sm" className="text-xs min-w-[50px]">
          {zoom}%
        </Button>

        <Button onClick={zoomIn} disabled={zoom >= 200} variant="ghost" size="sm">
          <ZoomIn className="w-4 h-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1"></div>

        <Button onClick={toggleFullscreen} variant="ghost" size="sm">
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>

        <div className="w-px h-5 bg-border mx-1"></div>

        <Button onClick={handleExportImage} disabled={isExporting} variant="ghost" size="sm" className="text-xs">
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>

      </div>

    </div>
  )
}

export default Previewer
