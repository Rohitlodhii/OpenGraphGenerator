"use client"

import React, { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, Download, Lock, Unlock, ImagePlus, Grid3x3, Settings2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import useDimensionStore from "@/hooks/dimension"
import Stage from "./Stage"
import BackgroundRenderer from "./BackgroundRenderer"
import ObjectsLayer from "./ObjectsLayer"
import GridOverlay from "./GridOverlay"
import GridSettingsDialog from "./GridSettingsDialog"
import ExportDialog from "./ExportDialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCanvasStore } from "@/store/canvasstore"
import { useGridStore } from "@/store/gridstore"
import { importImageFileLocally } from "@/lib/local-image-assets"

const createImageId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `image-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const getImageDimensions = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image()
    image.onload = () =>
      resolve({
        width: image.naturalWidth || 320,
        height: image.naturalHeight || 240,
      })
    image.onerror = reject
    image.src = src
  })

const hasDraggedFiles = (dataTransfer: DataTransfer) =>
  dataTransfer.types.includes("Files") ||
  Array.from(dataTransfer.items).some((item) => item.kind === "file")

const Previewer = () => {
  const isMobile = useIsMobile()
  const [zoomOverride, setZoomOverride] = useState<number | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [gridSettingsOpen, setGridSettingsOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const gridVisible = useGridStore((s) => s.gridVisible)
  const toggleGrid = useGridStore((s) => s.toggleGrid)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isImageDragging, setIsImageDragging] = useState(false)
  const addObject = useCanvasStore((state) => state.addObject)
  const defaultZoom = isMobile ? 25 : 70
  const zoom = zoomOverride ?? defaultZoom

  const width = useDimensionStore((s) => s.width)
  const height = useDimensionStore((s) => s.height)

  const previewRef = useRef<HTMLDivElement>(null)

  const handleImageDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsImageDragging(false)

    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    )
    if (files.length === 0) return

    const stage = previewRef.current?.querySelector<HTMLElement>(".canvas-stage")
    const stageRect = stage?.getBoundingClientRect()
    const droppedInsideStage =
      stageRect &&
      event.clientX >= stageRect.left &&
      event.clientX <= stageRect.right &&
      event.clientY >= stageRect.top &&
      event.clientY <= stageRect.bottom
    const dropX =
      droppedInsideStage && stageRect
        ? ((event.clientX - stageRect.left) / stageRect.width) * width
        : width / 2
    const dropY =
      droppedInsideStage && stageRect
        ? ((event.clientY - stageRect.top) / stageRect.height) * height
        : height / 2
    const maxZIndex = useCanvasStore
      .getState()
      .objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)

    await Promise.all(
      files.map(async (file, index) => {
        const imported = await importImageFileLocally(file)
        try {
          const dimensions = await getImageDimensions(imported.src)
          let fitScale = Math.min(
            1,
            Math.min(420, width * 0.6) / dimensions.width,
            Math.min(320, height * 0.6) / dimensions.height,
          )
          let imageWidth = dimensions.width * fitScale
          let imageHeight = dimensions.height * fitScale

          if (imageWidth < 24 || imageHeight < 24) {
            fitScale *= Math.max(24 / imageWidth, 24 / imageHeight)
            imageWidth = dimensions.width * fitScale
            imageHeight = dimensions.height * fitScale
          }

          const offset = index * 18
          addObject({
            id: createImageId(),
            type: "image",
            src: imported.src,
            imageAssetId: imported.assetId,
            imageFileName: imported.fileName,
            imageFileSize: imported.fileSize,
            imageMimeType: imported.mimeType,
            x: Math.max(0, Math.min(width - imageWidth, dropX - imageWidth / 2 + offset)),
            y: Math.max(0, Math.min(height - imageHeight, dropY - imageHeight / 2 + offset)),
            width: imageWidth,
            height: imageHeight,
            zIndex: maxZIndex + index + 1,
            imageCropX: 0,
            imageCropY: 0,
            imageCropScale: 1,
            imageBlendMode: "normal",
            imageGrain: 0,
            imageBlur: 0,
            imageBorderRadius: 8,
          })
        } catch {
          URL.revokeObjectURL(imported.src)
        }
      }),
    )
  }

  const zoomIn = React.useCallback(() => {
    setZoomOverride((current) =>
      Math.min((current ?? defaultZoom) + 10, 200),
    )
  }, [defaultZoom])
  const zoomOut = React.useCallback(() => {
    setZoomOverride((current) =>
      Math.max((current ?? defaultZoom) - 10, 25),
    )
  }, [defaultZoom])
  const resetZoom = () => {
    setZoomOverride(100)
  }

  // Keyboard shortcuts: Ctrl+= zoom in, Ctrl+- zoom out
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return
      if (e.key === "=" || e.key === "+") {
        e.preventDefault()
        zoomIn()
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault()
        zoomOut()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [zoomIn, zoomOut])

  // Ctrl + mouse wheel to zoom; plain wheel to pan (scroll) the preview
  useEffect(() => {
    const el = previewRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          zoomIn()
        } else if (e.deltaY > 0) {
          zoomOut()
        }
        return
      }
      if (locked) return
      e.preventDefault()
      // Shift = horizontal pan, otherwise vertical
      setPan((p) =>
        e.shiftKey
          ? { x: p.x - e.deltaY - e.deltaX, y: p.y }
          : { x: p.x - e.deltaX, y: p.y - e.deltaY }
      )
    }
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [locked, zoomIn, zoomOut])

  // Two-finger pinch to zoom (mobile)
  useEffect(() => {
    const el = previewRef.current
    if (!el) return

    let startDist = 0
    let startZoom = zoom

    const dist = (t: TouchList) => {
      const dx = t[0].clientX - t[1].clientX
      const dy = t[0].clientY - t[1].clientY
      return Math.hypot(dx, dy)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 2) return
      startDist = dist(e.touches)
      startZoom = zoom
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || startDist === 0) return
      e.preventDefault()
      const ratio = dist(e.touches) / startDist
      const next = Math.round(Math.min(200, Math.max(25, startZoom * ratio)))
      setZoomOverride(next)
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) startDist = 0
    }

    el.addEventListener("touchstart", onTouchStart, { passive: false })
    el.addEventListener("touchmove", onTouchMove, { passive: false })
    el.addEventListener("touchend", onTouchEnd)
    el.addEventListener("touchcancel", onTouchEnd)
    return () => {
      el.removeEventListener("touchstart", onTouchStart)
      el.removeEventListener("touchmove", onTouchMove)
      el.removeEventListener("touchend", onTouchEnd)
      el.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [zoom])

  return (
    <div className="w-full h-full flex flex-col bg-pattern relative">

      {/* Preview Area */}
      <div
        ref={previewRef}
        className="flex-1 relative overflow-hidden flex items-center justify-center touch-none"
        onDragEnter={(event) => {
          if (hasDraggedFiles(event.dataTransfer)) {
            setIsImageDragging(true)
          }
        }}
        onDragOver={(event) => {
          if (!hasDraggedFiles(event.dataTransfer)) return
          event.preventDefault()
          event.dataTransfer.dropEffect = "copy"
          setIsImageDragging(true)
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
          setIsImageDragging(false)
        }}
        onDrop={handleImageDrop}
      >
        <Stage width={width} height={height} zoom={zoom} locked={locked} position={pan} onPositionChange={setPan}>
          <BackgroundRenderer width={width} height={height} />
          <ObjectsLayer zoom={zoom} />
          <GridOverlay width={width} height={height} />
        </Stage>

        {isImageDragging && (
          <div className="pointer-events-none absolute inset-3 z-50 flex items-center justify-center rounded-2xl border-2 border-dashed border-primary/70 bg-primary/8 backdrop-blur-[2px]">
            <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-card/95 px-4 py-3 shadow-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ImagePlus className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Drop image to add</span>
                <span className="text-xs text-muted-foreground">
                  It will appear on the canvas and in Image Layers
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile lock toggle - lock canvas position (zoom still works) */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setLocked((p) => !p)}
            aria-pressed={locked}
            aria-label={locked ? "Unlock canvas position" : "Lock canvas position"}
            className={`absolute bottom-20 right-2 z-40 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg transition-colors ${
              locked
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border"
            }`}
          >
            {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>
        )}

        {/* Mobile grid menu — the full toolbar is desktop-only (`hidden md:flex`
            below), so grid controls get their own floating trigger here. */}
        {isMobile && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Grid options"
                className="absolute top-2 right-2 z-40 flex h-9 w-9 items-center justify-center rounded-full border shadow-lg bg-card text-muted-foreground border-border"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={gridVisible}
                onCheckedChange={toggleGrid}
                onSelect={(event) => event.preventDefault()}
              >
                <Grid3x3 />
                Grid
              </DropdownMenuCheckboxItem>
              <DropdownMenuItem onClick={() => setGridSettingsOpen(true)}>
                <Settings2 />
                Grid settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Toolbar */}
      <div className="absolute bottom-4 right-4 z-40 hidden md:flex items-center  bg-card rounded-lg px-1 py-1 shadow-lg border">

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

        <Group>
          <Button
            onClick={toggleGrid}
            variant={gridVisible ? "secondary" : "ghost"}
            size="sm"
            aria-pressed={gridVisible}
            aria-label="Toggle grid lines"
            title="Toggle grid lines"
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>

          <Button
            onClick={() => setGridSettingsOpen(true)}
            variant="ghost"
            size="sm"
            aria-label="Grid settings"
            title="Grid settings"
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </Group>

        <div className="w-px h-5 bg-border mx-1"></div>

        <Button onClick={() => setExportOpen(true)}  size="sm" className="text-xs ">
          <Download className="w-4 h-4" />
          Export
        </Button>

      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />
      <GridSettingsDialog open={gridSettingsOpen} onOpenChange={setGridSettingsOpen} />

    </div>
  )
}

export default Previewer
