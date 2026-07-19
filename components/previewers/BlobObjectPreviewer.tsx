"use client"

import React from "react"
import { blobs } from "@/data/blobs"
import { CanvasObject } from "@/store/canvasstore"

type Props = {
  object: CanvasObject
  style?: React.CSSProperties
}

// Extracts the viewBox and all <path d="..."> entries from a blob's raw SVG so
// we can re-render it with a solid fill (dropping the original gradient) and a
// grain overlay clipped to the blob shape.
const parseBlob = (svg: string) => {
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 400 400"
  const paths: string[] = []
  const pathRe = /<path\b[^>]*\bd="([^"]+)"[^>]*>/g
  let m: RegExpExecArray | null
  while ((m = pathRe.exec(svg)) !== null) {
    paths.push(m[1])
  }
  return { viewBox, paths }
}

const BlobObjectPreviewer: React.FC<Props> = ({ object, style }) => {
  const rawId = React.useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "")
  const blob = blobs.find((b) => b.id === object.blobId)

  const { viewBox, paths } = React.useMemo(
    () => parseBlob(blob?.svg ?? ""),
    [blob?.svg],
  )
  if (!blob) return null

  const fill = object.fill ?? blob.defaultColor
  const blur = object.blur ?? 0
  const grain = Math.max(0, Math.min(100, object.blobGrain ?? 0))
  const clipId = `blobclip-${uid}`

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{
        ...style,
        width: object.width ?? 200,
        height: object.height ?? 200,
        overflow: "visible",
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      <defs>
        <clipPath id={clipId}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
        {grain > 0 && (
          <filter id={`blobgrain-${uid}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={2}
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        )}
      </defs>

      {paths.map((d, i) => (
        <path key={i} d={d} fill={fill} />
      ))}

      {grain > 0 && (
        <g clipPath={`url(#${clipId})`}>
          <rect
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filter={`url(#blobgrain-${uid})`}
            opacity={grain / 100}
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
      )}
    </svg>
  )
}

export default BlobObjectPreviewer
