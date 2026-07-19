import useDimensionStore from "@/hooks/dimension"
import { useBackgroundStore } from "@/store/backgroundstore"
import { useCanvasStore } from "@/store/canvasstore"
import { useImageStore } from "@/store/imagestore"
import { useMeshStore } from "@/store/meshstore"
import { useSolidColorStore } from "@/store/solidcolorstore"
import useSvgGradientStore from "@/store/svggradientstore"
import { useGradientStore } from "@/store/gradientstore"

export type DesignPayload = {
  background: {
    backgroundColor: string
    backgroundType: "solid" | "mesh" | "image" | "Svg Gradient" | "gradient"
  }
  solidColor: {
    color: string
    blur: number
    grain: number
  }
  mesh: {
    baseColor: string
    blobs: {
      x: number
      y: number
      radius: number
      color: string
      opacity: number
      visible: boolean
    }[]
    blur: number
    grain: number
  }
  image: {
    src: string | null
    blur: number
    grain: number
    saturation: number
    contrast: number
    brightness: number
  }
  svgGradient: {
    pathsIndex: number
    visible: boolean
    fills: string[]
    blur: number
    backgroundColor: string
    offsetX: number
    offsetY: number
  }
  gradient: {
    appliedGradientId: string | null
  }
  canvas: {
    objects: ReturnType<typeof useCanvasStore.getState>["objects"]
    selectedObjectId: string | null
  }
  dimensions: {
    width: number
    height: number
  }
}

// Snapshots every design store into a single serializable payload.
export const buildPayload = (): DesignPayload => {
  const background = useBackgroundStore.getState()
  const solid = useSolidColorStore.getState()
  const mesh = useMeshStore.getState()
  const image = useImageStore.getState()
  const svg = useSvgGradientStore.getState()
  const gradient = useGradientStore.getState()
  const canvas = useCanvasStore.getState()
  const dims = useDimensionStore.getState()

  return {
    background: {
      backgroundColor: background.backgroundColor,
      backgroundType: background.backgroundType,
    },
    solidColor: {
      color: solid.color,
      blur: solid.blur,
      grain: solid.grain,
    },
    mesh: {
      baseColor: mesh.baseColor,
      blobs: mesh.blobs.map((blob) => ({ ...blob })),
      blur: mesh.blur,
      grain: mesh.grain,
    },
    image: {
      src: image.src,
      blur: image.blur,
      grain: image.grain,
      saturation: image.saturation,
      contrast: image.contrast,
      brightness: image.brightness,
    },
    svgGradient: {
      pathsIndex: svg.pathsIndex,
      visible: svg.visible,
      fills: [...svg.fills],
      blur: svg.blur,
      backgroundColor: svg.backgroundColor,
      offsetX: svg.offsetX,
      offsetY: svg.offsetY,
    },
    gradient: {
      appliedGradientId: gradient.appliedGradientId,
    },
    canvas: {
      objects: canvas.objects.map((object) => ({ ...object })),
      selectedObjectId: canvas.selectedObjectId,
    },
    dimensions: {
      width: dims.width,
      height: dims.height,
    },
  }
}

// Restores every design store from a previously built payload.
export const applyPayload = (payload: DesignPayload) => {
  useBackgroundStore.setState({
    backgroundColor: payload.background.backgroundColor,
    backgroundType: payload.background.backgroundType,
  })

  useSolidColorStore.setState({
    color: payload.solidColor.color,
    blur: payload.solidColor.blur,
    grain: payload.solidColor.grain,
  })

  useMeshStore.setState({
    baseColor: payload.mesh.baseColor,
    blobs: payload.mesh.blobs.map((blob) => ({ ...blob })),
    blur: payload.mesh.blur,
    grain: payload.mesh.grain,
  })

  useImageStore.setState({
    src: payload.image.src,
    blur: payload.image.blur,
    grain: payload.image.grain,
    saturation: payload.image.saturation,
    contrast: payload.image.contrast,
    brightness: payload.image.brightness,
  })

  useSvgGradientStore.setState({
    pathsIndex: payload.svgGradient.pathsIndex,
    visible: payload.svgGradient.visible,
    fills: [...payload.svgGradient.fills],
    blur: payload.svgGradient.blur,
    backgroundColor: payload.svgGradient.backgroundColor,
    offsetX: payload.svgGradient.offsetX,
    offsetY: payload.svgGradient.offsetY,
  })

  useGradientStore.setState({
    appliedGradientId: payload.gradient?.appliedGradientId ?? null,
  })

  useCanvasStore.setState({
    objects: payload.canvas.objects.map((object) => ({ ...object })),
    selectedObjectId: payload.canvas.selectedObjectId,
  })

  useDimensionStore.setState({
    width: payload.dimensions.width,
    height: payload.dimensions.height,
  })
}
