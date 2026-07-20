"use client"

import React from "react"
import { CanvasObject } from "@/store/canvasstore"
import { AsciiArt } from "../ui/ascii-art"

type Props = {
  object: CanvasObject
  style?: React.CSSProperties
}

// Renders an image as ASCII art inside the object's box. The source image lives
// on `src`; the ascii* fields drive the AsciiArt renderer. Animation is disabled
// on the canvas so the art stays static while editing/exporting.
const AsciiObjectPreviewer: React.FC<Props> = ({ object, style }) => {
  if (!object.src) return null

  const width = object.width ?? 300
  const height = object.height ?? 300

  return (
    <div style={{ ...style, width, height }}>
      <AsciiArt
        src={object.src}
        resolution={object.asciiResolution ?? 100}
        charset={object.asciiCharset ?? "standard"}
        color={object.asciiColor ?? "#ffffff"}
        backgroundColor={object.asciiBackgroundColor ?? "#0a0a0a"}
        inverted={object.asciiInverted ?? false}
        colored={object.asciiColored ?? false}
        animated={false}
        animationStyle="none"
        objectFit={object.asciiObjectFit ?? "cover"}
        className="h-full w-full"
      />
    </div>
  )
}

export default AsciiObjectPreviewer
