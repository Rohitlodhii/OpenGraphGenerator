"use client"

import React from "react"
import { motifs } from "@/data/motifs"
import { CanvasObject } from "@/store/canvasstore"

type Props = {
  object: CanvasObject
  style?: React.CSSProperties
}

// Renders a motif SVG as a non-editable image. Blur is applied via CSS filter;
// grain is a noise overlay masked to the motif's own shape so it only textures
// the artwork, not the surrounding box.
const MotifObjectPreviewer: React.FC<Props> = ({ object, style }) => {
  const rawId = React.useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "")
  const motif = motifs.find((m) => m.id === object.motifId)
  if (!motif) return null

  const width = object.width ?? 200
  const height = object.height ?? 200
  const blur = object.blur ?? 0
  const grain = Math.max(0, Math.min(100, object.motifGrain ?? 0))

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url(${motif.src})`,
    maskImage: `url(${motif.src})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  }

  return (
    <div
      style={{
        ...style,
        width,
        height,
        position: "relative",
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={motif.src}
        alt={motif.name}
        draggable={false}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />

      {grain > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: grain / 100,
            mixBlendMode: "overlay",
            ...maskStyle,
          }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id={`motifgrain-${uid}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.8"
                numOctaves={2}
                stitchTiles="stitch"
              />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#motifgrain-${uid})`}
            />
          </svg>
        </div>
      )}
    </div>
  )
}

export default MotifObjectPreviewer
