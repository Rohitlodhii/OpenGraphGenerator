"use client"

import React, { useEffect, useState } from "react"
import { useImageStore } from "@/store/imagestore"

interface ImagePreviewerProps {
  width: number
  height: number
  className?: string
}

// helper to generate noise data url
function makeNoise(w: number, h: number): string {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.createImageData(w, h)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const v = (Math.random() - 0.5) * 255
    d[i] = d[i + 1] = d[i + 2] = v
    d[i + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ width, height, className }) => {
  const { src, blur, grain, saturation, contrast, brightness } = useImageStore()
  const [noiseUrl, setNoiseUrl] = useState<string | null>(null)

  useEffect(() => {
    if (grain > 0) {
      setNoiseUrl(makeNoise(width, height))
    } else {
      setNoiseUrl(null)
    }
  }, [grain, width, height])

  const filter = `blur(${blur}px) saturate(${saturation}) contrast(${contrast}) brightness(${brightness})`

  return (
    <div
      className={className}
      style={{ position: 'relative', width, height, overflow: 'hidden' }}
    >
      {src && (
        <img
          src={src}
          style={{
            width,
            height,
            objectFit: 'cover',
            filter,
          }}
        />
      )}
      {noiseUrl && (
        <img
          src={noiseUrl}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width,
            height,
            opacity: grain,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

export default ImagePreviewer
