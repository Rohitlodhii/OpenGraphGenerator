"use client"

import React from "react"
import { CanvasObject } from "@/store/canvasstore"
import { getMockup } from "../mockups/registry"

type Props = {
  object: CanvasObject
  style?: React.CSSProperties
}

const DEFAULT_SCREEN_COLOR = "#ffffff"

// Renders a device mockup (iPhone / iPad / Mac / Safari) scaled to the object's
// box. The device's screen shows the embedded image (`src`) when present; its
// empty area is tinted via the SVG's `currentColor`, driven here by `color`.
const MockupObjectPreviewer: React.FC<Props> = ({ object, style }) => {
  const def = getMockup(object.mockupId)
  if (!def) return null

  const width = object.width ?? 300
  const height = object.height ?? Math.round(width / def.aspect)
  const { Component } = def

  return (
    <div
      style={{
        ...style,
        width,
        height,
        color: object.fill ?? DEFAULT_SCREEN_COLOR,
      }}
    >
      <Component
        width={def.nativeWidth}
        height={def.nativeHeight}
        src={object.src || undefined}
        url={def.hasUrl ? object.mockupUrl : undefined}
        fit={object.mockupImageFit ?? "cover"}
        theme={object.mockupTheme ?? def.defaultTheme}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  )
}

export default MockupObjectPreviewer
