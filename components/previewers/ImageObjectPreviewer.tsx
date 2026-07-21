"use client"

import React from "react"
import { CanvasObject } from "@/store/canvasstore"

type ImageObjectPreviewerProps = {
  object: CanvasObject
  style?: React.CSSProperties
}

const ImageObjectPreviewer: React.FC<ImageObjectPreviewerProps> = ({ object, style }) => {
  const cropScale = object.imageCropScale ?? 1
  const cropX = object.imageCropX ?? 0
  const cropY = object.imageCropY ?? 0
  const blur = Math.max(0, object.imageBlur ?? 0)
  const grain = Math.max(0, Math.min(100, object.imageGrain ?? 0))
  const opacity = Math.max(0, Math.min(100, object.imageOpacity ?? 100)) / 100
  const borderRadius = Math.max(0, object.imageBorderRadius ?? 8)
  const blendMode = (object.imageBlendMode ?? "normal") as React.CSSProperties["mixBlendMode"]
  const strokeColor = object.imageStrokeColor
  const strokeWidth = strokeColor ? object.imageStrokeWidth ?? 2 : 0

  return (
    <div
      style={{
        ...style,
        width: object.width ?? 260,
        height: object.height ?? 180,
        borderRadius,
        overflow: "hidden",
        position: "relative",
        background: "rgba(255,255,255,0.06)",
        border: strokeColor && strokeWidth > 0 ? `${strokeWidth}px solid ${strokeColor}` : undefined,
        boxSizing: "border-box",
        mixBlendMode: blendMode,
        opacity,
      }}
    >
      <img
        src={object.src}
        alt=""
        draggable={false}
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(calc(-50% + ${cropX}px), calc(-50% + ${cropY}px)) scale(${cropScale})`,
          transformOrigin: "center",
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          userSelect: "none",
          pointerEvents: "none",
        }}
      />

      {grain > 0 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            mixBlendMode: "overlay",
            opacity: grain / 100,
          }}
        >
          <filter id={`imageGrain-${object.id}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={2}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#imageGrain-${object.id})`} />
        </svg>
      )}
    </div>
  )
}

export default ImageObjectPreviewer
