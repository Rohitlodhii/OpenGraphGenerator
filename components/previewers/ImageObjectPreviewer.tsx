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

  return (
    <div
      style={{
        ...style,
        width: object.width ?? 260,
        height: object.height ?? 180,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <img
        src={object.src}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translate(calc(-50% + ${cropX}px), calc(-50% + ${cropY}px)) scale(${cropScale})`,
          transformOrigin: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  )
}

export default ImageObjectPreviewer
