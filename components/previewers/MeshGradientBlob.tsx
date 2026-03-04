"use client"

import React, { useRef, useEffect } from "react"
import { useMeshStore } from "@/store/meshstore"

interface MeshGradientBlobProps {
  width: number
  height: number
  className?: string
}

const MeshGradientBlob: React.FC<MeshGradientBlobProps> = ({
  width,
  height,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { baseColor, blobs, blur, grain } = useMeshStore()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // clear and draw background
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = baseColor
    ctx.fillRect(0, 0, width, height)

    // draw mesh blobs
    ctx.globalCompositeOperation = "lighter"
    ctx.filter = `blur(${blur}px)`

    blobs.forEach(({ x, y, radius, color, opacity, visible }) => {
      if (!visible) return

      const gradient = ctx.createRadialGradient(
        x * width,
        y * height,
        0,
        x * width,
        y * height,
        radius,
      )

      gradient.addColorStop(0, color)
      gradient.addColorStop(1, "transparent")

      ctx.save()
      ctx.globalAlpha = opacity
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x * width, y * height, radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })

    ctx.globalCompositeOperation = "source-over"
    ctx.filter = "none"

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
  }, [width, height, baseColor, blur, grain, blobs])

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

export default MeshGradientBlob
