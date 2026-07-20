"use client"

import React, { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Download, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import useDimensionStore from "@/hooks/dimension"
import Stage from "./Stage"
import BackgroundRenderer from "./BackgroundRenderer"
import ObjectsLayer from "./ObjectsLayer"
import ExportDialog from "./ExportDialog"
import { useIsMobile } from "@/hooks/use-mobile"

const Previewer = () => {
  const isMobile = useIsMobile()
  const [zoom, setZoom] = useState(70)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [locked, setLocked] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const zoomTouched = useRef(false)

  // Default to 25% on mobile until the user manually changes zoom
  useEffect(() => {
    if (zoomTouched.current) return
    setZoom(isMobile ? 25 : 70)
  }, [isMobile])

  const width = useDimensionStore((s) => s.width)
  const height = useDimensionStore((s) => s.height)

  const previewRef = useRef<HTMLDivElement>(null)

  const zoomIn = () => {
    zoomTouched.current = true
    setZoom((z) => Math.min(z + 10, 200))
  }
  const zoomOut = () => {
    zoomTouched.current = true
    setZoom((z) => Math.max(z - 10, 25))
  }
  const resetZoom = () => {
    zoomTouched.current = true
    setZoom(100)
  }

  const toggleFullscreen = () => setIsFullscreen((p) => !p)

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
  }, [])

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
  }, [locked])

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
      zoomTouched.current = true
      const ratio = dist(e.touches) / startDist
      const next = Math.round(Math.min(200, Math.max(25, startZoom * ratio)))
      setZoom(next)
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
      <div ref={previewRef} className="flex-1 relative overflow-hidden flex items-center justify-center touch-none">
        <Stage width={width} height={height} zoom={zoom} locked={locked} position={pan} onPositionChange={setPan}>
          <BackgroundRenderer width={width} height={height} />
          <ObjectsLayer zoom={zoom} />
        </Stage>

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

        <Button onClick={() => setExportOpen(true)}  size="sm" className="text-xs ">
          <Download className="w-4 h-4" />
          Export
        </Button>

      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />

    </div>
  )
}

export default Previewer
