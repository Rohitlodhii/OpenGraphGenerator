"use client"

import React from "react"
import useSvgGradientStore from "@/store/svggradientstore"
import { svgPaths } from "@/data/svgpaths"

type Props = {
  width?: number
  height?: number
  className?: string
}

const SvgGradientPreviewer: React.FC<Props> = ({
  width = 400,
  height = 300,
  className
}) => {
  const { pathsIndex, fills, blur, grain, backgroundColor, offsetX, offsetY } =
    useSvgGradientStore()

  const svgData = svgPaths[pathsIndex]
  if (!svgData) return null

  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: backgroundColor,
        overflow: "hidden",
        position: "relative"
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={svgData.viewBox}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter
            id="blurFilter"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation={blur} />
          </filter>
        </defs>

        <g
          transform={`translate(${offsetX}, ${offsetY})`}
          filter={blur > 0 ? "url(#blurFilter)" : undefined}
        >
          {svgData.paths.map((p, idx) => {
            const fill = fills?.[idx] ?? p.fill
            return (
              <path
                key={idx}
                d={p.d}
                fill={fill}
                opacity={1}
              />
            )
          })}
        </g>
      </svg>

      {grain > 0 && (
        <svg
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            mixBlendMode: "overlay",
            opacity: grain / 100
          }}
        >
          <filter id="grainFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={2}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grainFilter)" />
        </svg>
      )}
    </div>
  )
}

export default SvgGradientPreviewer