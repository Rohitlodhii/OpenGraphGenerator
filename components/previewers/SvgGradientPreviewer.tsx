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
  const { pathsIndex, fills, blur, backgroundColor, offsetX, offsetY } =
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
        overflow: "hidden"
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
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
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
    </div>
  )
}

export default SvgGradientPreviewer