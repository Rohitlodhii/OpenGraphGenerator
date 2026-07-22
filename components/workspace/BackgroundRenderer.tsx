"use client"

import React from "react"
import { useBackgroundStore } from "@/store/backgroundstore"
import MeshGradientBlob from "../previewers/MeshGradientBlob"
import SolidColorPreviewer from "../previewers/SolidColorPreviewer"
import ImagePreviewer from "../previewers/ImagePreviewer"
import SvgGradientPreviewer from "../previewers/SvgGradientPreviewer"
import LightGradientPreviewer from "../previewers/LightGradientPreviewer"
import CustomGradientPreviewer from "../previewers/CustomGradientPreviewer"

type BackgroundRendererProps = {
  width: number
  height: number
}

const BackgroundRenderer: React.FC<BackgroundRendererProps> = ({ width, height }) => {
  const backgroundType = useBackgroundStore((state) => state.backgroundType)

  return (
    <div className="absolute inset-0">
      {backgroundType === "solid" && (
        <SolidColorPreviewer width={width} height={height} />
      )}
      {backgroundType === "image" && (
        <ImagePreviewer width={width} height={height} />
      )}
      {backgroundType === "Svg Gradient" && (
        <SvgGradientPreviewer width={width} height={height} />
      )}
      {backgroundType === "gradient" && (
        <LightGradientPreviewer width={width} height={height} />
      )}
      {backgroundType === "mesh" && (
        <MeshGradientBlob width={width} height={height} />
      )}
      {backgroundType === "customGradient" && (
        <CustomGradientPreviewer width={width} height={height} />
      )}
    </div>
  )
}

export default BackgroundRenderer

