"use client"
import React, { useState, useRef } from 'react'
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardPanel } from '@/components/ui/card'
import useDimensionStore from '@/hooks/dimension'
import Draggable from 'react-draggable'

const Previewer = () => {
  const [zoom, setZoom] = useState(70)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const width = useDimensionStore(state => state.width)
  const height = useDimensionStore(state => state.height)

  const dragRef = useRef<HTMLDivElement>(null)

  const zoomIn = () => setZoom(prev => Math.min(prev + 10, 200))
  const zoomOut = () => setZoom(prev => Math.max(prev - 10, 25))
  const resetZoom = () => setZoom(100)

  const toggleFullscreen = () => setIsFullscreen(prev => !prev)

  return (
    <div className='w-full h-full flex flex-col bg-background text-foreground relative'>

      {/* Preview Area */}
      <div className='flex-1 overflow-hidden bg-background relative'>

        <Draggable nodeRef={dragRef}>
          <div
            ref={dragRef}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%)`,
              cursor: 'grab',
            }}
          >
            {/* SCALE ONLY THIS */}
            <div
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
              }}
            >
              <Card
                className="shadow-xl"
                style={{
                  width,
                  height,
                }}
              >
                <CardPanel className='flex items-center justify-center h-full text-muted-foreground'>
                  Preview Content
                </CardPanel>
              </Card>
            </div>
          </div>
        </Draggable>

      </div>

      {/* Toolbar */}
      <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-card rounded-full px-4 py-3 shadow-lg border'>
        
        <Button onClick={zoomOut} disabled={zoom <= 25} variant="ghost" size="icon-sm">
          <ZoomOut className='w-4 h-4' />
        </Button>

        <Button onClick={resetZoom} variant="ghost" size="sm" className='text-xs min-w-[50px]'>
          {zoom}%
        </Button>

        <Button onClick={zoomIn} disabled={zoom >= 200} variant="ghost" size="icon-sm">
          <ZoomIn className='w-4 h-4' />
        </Button>

        <div className='w-px h-5 bg-border mx-1'></div>

        <Button onClick={toggleFullscreen} variant="ghost" size="icon-sm">
          {isFullscreen ? (
            <Minimize2 className='w-4 h-4' />
          ) : (
            <Maximize2 className='w-4 h-4' />
          )}
        </Button>

      </div>

    </div>
  )
}

export default Previewer