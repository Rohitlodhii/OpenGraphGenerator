"use client"

import React, { useRef, useEffect } from "react"
import { useSolidColorStore } from "@/store/solidcolorstore"

interface SolidColorPreviewerProps {
  width: number
  height: number
  className?: string
}

const SolidColorPreviewer: React.FC<SolidColorPreviewerProps> = ({
  width,
  height,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { color, blur, grain } = useSolidColorStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // fill with solid color
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)

    // apply blur filter
    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`
      ctx.fillRect(0, 0, width, height)
      ctx.filter = "none"
    }

    // film grain
    if (grain > 0) {
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 255 * grain
        data[i] += noise
        data[i + 1] += noise
        data[i + 2] += noise
      }

      ctx.putImageData(imageData, 0, 0)
    }
  }, [width, height, color, blur, grain])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
      style={{ display: "block", width, height }}
    />
  )
}

export default SolidColorPreviewer
