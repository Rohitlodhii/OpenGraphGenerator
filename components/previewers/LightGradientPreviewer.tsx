"use client"

import React from "react"
import { useGradientStore } from "@/store/gradientstore"
import { libraryGradients } from "@/data/gradients"
import RawGradientSvg from "./RawGradientSvg"

type Props = {
  width?: number
  height?: number
  className?: string
}

// Renders the currently applied library gradient as a full-bleed background.
const LightGradientPreviewer: React.FC<Props> = ({
  width = 400,
  height = 300,
  className,
}) => {
  const appliedGradientId = useGradientStore((s) => s.appliedGradientId)
  const gradient = libraryGradients.find((g) => g.id === appliedGradientId)
  if (!gradient) return null

  return (
    <div className={className} style={{ width, height, overflow: "hidden" }}>
      <RawGradientSvg svg={gradient.svg} />
    </div>
  )
}

export default LightGradientPreviewer
