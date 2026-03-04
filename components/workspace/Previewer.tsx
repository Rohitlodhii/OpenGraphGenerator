"use client"

import React, { useState, useRef } from "react"
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import useDimensionStore from "@/hooks/dimension"
import Draggable from "react-draggable"
import { useBackgroundStore } from "@/store/backgroundstore"
import { useMeshStore } from "@/store/meshstore"
import MeshGradientBlob from "../previewers/MeshGradientBlob"
import SolidColorPreviewer from "../previewers/SolidColorPreviewer"
import ImagePreviewer from "../previewers/ImagePreviewer"
import SvgGradientPreviewer from "../previewers/SvgGradientPreviewer"
import { useImageStore } from "@/store/imagestore"

const Previewer = () => {
  const [zoom, setZoom] = useState(70)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const width = useDimensionStore((s) => s.width)
  const height = useDimensionStore((s) => s.height)
  const { backgroundType } = useBackgroundStore()
  const { src } = useImageStore()

  const dragRef = useRef<HTMLDivElement>(null)


  const zoomIn = () => setZoom((z) => Math.min(z + 10, 200))
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 25))
  const resetZoom = () => setZoom(100)

  const toggleFullscreen = () => setIsFullscreen((p) => !p)

  return (
    <div className="w-full h-full flex flex-col bg-pattern relative">

      {/* Preview Area */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">

        <Draggable nodeRef={dragRef} defaultPosition={{ x: 0, y: 0 }}>
          <div ref={dragRef} className="cursor-grab">
            
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
              }}
            >
              {backgroundType === 'solid' && (
                <SolidColorPreviewer width={width} height={height} className="shadow-xl rounded-lg" />
              )}
              {backgroundType === 'image' && (
                <ImagePreviewer width={width} height={height} className="shadow-xl rounded-lg" />
              )}
              {backgroundType === 'Svg Gradient' && (
                <SvgGradientPreviewer width={width} height={height} className="shadow-xl rounded-lg" />
              )}
              {backgroundType === 'mesh' && (
                <MeshGradientBlob width={width} height={height} className="shadow-xl rounded-lg" />
              )}
            </div>

          </div>
        </Draggable>

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

      </div>

    </div>
  )
}

export default Previewer