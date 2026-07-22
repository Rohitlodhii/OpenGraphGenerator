"use client"

import React from "react"
import { useCustomGradientStore } from "@/store/customgradientstore"
import { buildCssGradient } from "@/lib/custom-gradient"

type Props = {
  width: number
  height: number
  className?: string
}

const CustomGradientPreviewer: React.FC<Props> = ({ width, height, className }) => {
  const mode = useCustomGradientStore((s) => s.mode)
  const angle = useCustomGradientStore((s) => s.angle)
  const radialShape = useCustomGradientStore((s) => s.radialShape)
  const stops = useCustomGradientStore((s) => s.stops)
  const grain = Math.max(0, Math.min(100, useCustomGradientStore((s) => s.grain)))

  const background = buildCssGradient(mode, angle, radialShape, stops)

  return (
    <div
      className={className}
      style={{ width, height, position: "relative", overflow: "hidden", background }}
    >
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
          <filter id="customGradientGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={2}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#customGradientGrain)" />
        </svg>
      )}
    </div>
  )
}

export default CustomGradientPreviewer
