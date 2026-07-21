"use client"

import React from "react"
import type { CanvasObject } from "@/store/canvasstore"
import { buildCssGradientStyle } from "@/lib/css-presets"

type Props = {
  object: CanvasObject
  style?: React.CSSProperties
}

// Renders a CSS preset (pattern background, radial glow, or gradient
// decoration) inside a fixed-size, clipped object box. The source presets are
// authored as a full-screen wrapper (bg color) plus an inner layer that paints
// the actual gradient/pattern; we reproduce that two-layer structure but pin it
// to the object's width/height instead of the viewport.
const CssPresetPreviewer: React.FC<Props> = ({ object, style }) => {
  const inner = buildCssGradientStyle(
    object.cssStyle ?? {},
    object.cssGradientLayers,
  ) as React.CSSProperties
  const radius = object.cssRadius ?? 0
  const opacity = Math.max(0, Math.min(100, object.cssOpacity ?? 100)) / 100
  const blur = Math.max(0, object.cssBlur ?? 0)
  const grain = Math.max(0, Math.min(100, object.cssGrain ?? 0))
  const backgroundColor =
    object.cssBackgroundEnabled === undefined
      ? undefined
      : object.cssBackgroundEnabled
        ? object.cssBackgroundColor ?? "#ffffff"
        : "transparent"

  return (
    <div
      className={`isolate ${object.cssWrapperClassName ?? ""}`}
      style={{
        ...style,
        position: "relative",
        width: object.width,
        height: object.height,
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        borderRadius: radius,
        opacity,
        contain: "layout paint",
        backgroundColor,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: blur > 0 ? -blur * 2 : 0,
          minHeight: 0,
          filter: blur > 0 ? `blur(${blur}px)` : undefined,
          ...inner,
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
          <filter id={`cssPresetGrain-${object.id}`}>
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
            filter={`url(#cssPresetGrain-${object.id})`}
          />
        </svg>
      )}
    </div>
  )
}

export default CssPresetPreviewer
