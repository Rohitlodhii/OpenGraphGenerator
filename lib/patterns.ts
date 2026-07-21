import type { CSSProperties } from "react"
import type { CanvasPatternType } from "@/store/canvasstore"

export type PatternDef = {
  type: CanvasPatternType
  label: string
}

export const PATTERNS: PatternDef[] = [
  { type: "dots", label: "Dots" },
  { type: "grid", label: "Grid" },
  { type: "cross", label: "Cross" },
  { type: "diagonal", label: "Diagonal" },
  { type: "horizontal", label: "Horizontal" },
  { type: "vertical", label: "Vertical" },
  { type: "gradient-grid-right", label: "Gradient Grid Right" },
  { type: "gradient-grid-left", label: "Gradient Grid Left" },
  { type: "dual-gradient-grid", label: "Dual Gradient Grid" },
  { type: "top-fade-grid", label: "Top Fade Grid" },
  { type: "bottom-fade-grid", label: "Bottom Fade Grid" },
  { type: "center-fade-grid", label: "Center Fade Grid" },
  { type: "diagonal-cross-grid", label: "Diagonal Cross Grid" },
  { type: "diagonal-cross-fade", label: "Diagonal Cross Fade" },
  { type: "dashed-grid", label: "Dashed Grid" },
  { type: "dashed-center-fade", label: "Dashed Center Fade" },
  { type: "circuit-board", label: "Circuit Board" },
  { type: "zigzag-lightning", label: "Zigzag Lightning" },
  { type: "grid-with-dots", label: "Grid with Dots" },
  { type: "colored-noise", label: "Colored Noise" },
  { type: "striped-grid-spotlight", label: "Striped Grid Spotlight" },
]

export const DEFAULT_PATTERN_COLOR = "#ffffff"
export const DEFAULT_PATTERN_SCALE = 24
export const DEFAULT_PATTERN_OPACITY = 100

const BASIC_PATTERN_TYPES = new Set<CanvasPatternType>([
  "dots",
  "grid",
  "cross",
  "diagonal",
  "horizontal",
  "vertical",
])

const tileContent = (
  type: CanvasPatternType,
  size: number,
  color: string,
): string => {
  const stroke = Math.max(1, Math.round(size / 16))
  switch (type) {
    case "dots":
      return `<circle cx="${size / 2}" cy="${size / 2}" r="${Math.max(1, size / 10)}" fill="${color}" />`
    case "grid":
      return `<path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="${color}" stroke-width="${stroke}" />`
    case "cross": {
      const center = size / 2
      const arm = size / 6
      return `<path d="M ${center - arm} ${center} L ${center + arm} ${center} M ${center} ${center - arm} L ${center} ${center + arm}" stroke="${color}" stroke-width="${stroke}" />`
    }
    case "diagonal":
      return `<path d="M 0 ${size} L ${size} 0 M -${size / 4} ${size / 4} L ${size / 4} -${size / 4} M ${(size * 3) / 4} ${(size * 5) / 4} L ${(size * 5) / 4} ${(size * 3) / 4}" stroke="${color}" stroke-width="${stroke}" />`
    case "horizontal":
      return `<path d="M 0 ${size / 2} L ${size} ${size / 2}" stroke="${color}" stroke-width="${stroke}" />`
    case "vertical":
      return `<path d="M ${size / 2} 0 L ${size / 2} ${size}" stroke="${color}" stroke-width="${stroke}" />`
    default:
      return ""
  }
}

export const buildPatternSvg = (
  type: CanvasPatternType,
  {
    width,
    height,
    size = DEFAULT_PATTERN_SCALE,
    color = DEFAULT_PATTERN_COLOR,
  }: { width: number; height: number; size?: number; color?: string },
): string => {
  const id = `pat-${type}`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><defs><pattern id="${id}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">${tileContent(type, size, color)}</pattern></defs><rect width="${width}" height="${height}" fill="url(#${id})" /></svg>`
}

export const patternToDataUri = (svg: string): string =>
  `url("data:image/svg+xml,${encodeURIComponent(svg)}")`

const colorToRgba = (color: string, alpha: number) => {
  const normalized = color.trim().replace("#", "")
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized
  const valid = /^[0-9a-fA-F]{6}$/.test(expanded) ? expanded : "ffffff"
  const red = parseInt(valid.slice(0, 2), 16)
  const green = parseInt(valid.slice(2, 4), 16)
  const blue = parseInt(valid.slice(4, 6), 16)
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`
}

const maskStyle = (maskImage: string): CSSProperties => ({
  maskImage,
  WebkitMaskImage: maskImage,
})

export const buildPatternStyle = (
  type: CanvasPatternType,
  {
    width,
    height,
    size = DEFAULT_PATTERN_SCALE,
    color = DEFAULT_PATTERN_COLOR,
  }: { width: number; height: number; size?: number; color?: string },
): CSSProperties => {
  const safeSize = Math.max(4, size)
  const faint = colorToRgba(color, 0.2)
  const soft = colorToRgba(color, 0.32)
  const strong = colorToRgba(color, 0.55)
  const line = `${Math.max(1, Math.round(safeSize / 24))}px`
  const grid = [
    `linear-gradient(to right, ${soft} ${line}, transparent ${line})`,
    `linear-gradient(to bottom, ${soft} ${line}, transparent ${line})`,
  ]

  if (BASIC_PATTERN_TYPES.has(type)) {
    return {
      backgroundImage: patternToDataUri(
        buildPatternSvg(type, { width, height, size: safeSize, color }),
      ),
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    }
  }

  switch (type) {
    case "gradient-grid-right":
    case "gradient-grid-left": {
      const horizontal = Math.round(safeSize * 1.5)
      const vertical = safeSize
      const side = type === "gradient-grid-right" ? "100%" : "0%"
      return {
        backgroundImage: [
          ...grid,
          `radial-gradient(circle at ${side} 32%, ${strong}, transparent 58%)`,
        ].join(", "),
        backgroundSize: `${horizontal}px ${vertical}px, ${horizontal}px ${vertical}px, 100% 100%`,
        backgroundRepeat: "repeat, repeat, no-repeat",
      }
    }

    case "dual-gradient-grid":
      return {
        backgroundImage: [
          ...grid,
          `radial-gradient(circle at 20% 20%, ${soft}, transparent 45%)`,
          `radial-gradient(circle at 80% 80%, ${faint}, transparent 45%)`,
        ].join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px, ${safeSize}px ${safeSize}px, 100% 100%, 100% 100%`,
        backgroundRepeat: "repeat, repeat, no-repeat, no-repeat",
      }

    case "top-fade-grid":
      return {
        backgroundImage: grid.join(", "),
        backgroundSize: `${safeSize}px ${Math.round(safeSize * 1.5)}px`,
        ...maskStyle(
          "radial-gradient(ellipse 70% 60% at 50% 0%, black 55%, transparent 100%)",
        ),
      }

    case "bottom-fade-grid":
      return {
        backgroundImage: grid.join(", "),
        backgroundSize: `${safeSize}px ${Math.round(safeSize * 1.5)}px`,
        ...maskStyle(
          "radial-gradient(ellipse 70% 60% at 50% 100%, black 55%, transparent 100%)",
        ),
      }

    case "center-fade-grid":
      return {
        backgroundImage: grid.join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px`,
        ...maskStyle(
          "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 72%)",
        ),
      }

    case "diagonal-cross-grid":
    case "diagonal-cross-fade": {
      const style: CSSProperties = {
        backgroundImage: [
          `linear-gradient(45deg, transparent 48%, ${soft} 49%, ${soft} 51%, transparent 52%)`,
          `linear-gradient(-45deg, transparent 48%, ${soft} 49%, ${soft} 51%, transparent 52%)`,
        ].join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px`,
      }
      return type === "diagonal-cross-fade"
        ? {
            ...style,
            ...maskStyle(
              "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 72%)",
            ),
          }
        : style
    }

    case "dashed-grid":
    case "dashed-center-fade": {
      const dash = Math.max(2, Math.round(safeSize * 0.18))
      const gap = Math.max(dash + 2, Math.round(safeSize * 0.45))
      const dashMasks = [
        `repeating-linear-gradient(to right, black 0 ${dash}px, transparent ${dash}px ${gap}px)`,
        `repeating-linear-gradient(to bottom, black 0 ${dash}px, transparent ${dash}px ${gap}px)`,
      ]
      if (type === "dashed-center-fade") {
        dashMasks.push(
          "radial-gradient(ellipse 60% 60% at 50% 50%, black 30%, transparent 72%)",
        )
      }
      return {
        backgroundImage: grid.join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px`,
        maskImage: dashMasks.join(", "),
        WebkitMaskImage: dashMasks.join(", "),
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }
    }

    case "circuit-board": {
      const half = safeSize / 2
      return {
        backgroundImage: [
          `repeating-linear-gradient(0deg, transparent 0, transparent ${half - 1}px, ${faint} ${half - 1}px, ${faint} ${half}px)`,
          `repeating-linear-gradient(90deg, transparent 0, transparent ${half - 1}px, ${faint} ${half - 1}px, ${faint} ${half}px)`,
          `radial-gradient(circle at ${half}px ${half}px, ${strong} 1.5px, transparent 2px)`,
          `radial-gradient(circle at ${safeSize}px ${safeSize}px, ${soft} 1.5px, transparent 2px)`,
        ].join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px`,
      }
    }

    case "zigzag-lightning":
      return {
        backgroundImage: [
          `repeating-linear-gradient(0deg, transparent 0 ${safeSize - 1}px, ${soft} ${safeSize - 1}px ${safeSize}px)`,
          `repeating-linear-gradient(90deg, transparent 0 ${safeSize * 1.5 - 1}px, ${faint} ${safeSize * 1.5 - 1}px ${safeSize * 1.5}px)`,
          `repeating-linear-gradient(60deg, transparent 0 ${safeSize * 2 - 1}px, ${faint} ${safeSize * 2 - 1}px ${safeSize * 2}px)`,
          `repeating-linear-gradient(150deg, transparent 0 ${safeSize * 1.75 - 1}px, ${faint} ${safeSize * 1.75 - 1}px ${safeSize * 1.75}px)`,
        ].join(", "),
      }

    case "grid-with-dots":
      return {
        backgroundImage: [
          ...grid,
          `radial-gradient(circle, ${strong} 1.5px, transparent 1.8px)`,
        ].join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px`,
      }

    case "colored-noise":
      return {
        backgroundImage: [
          `radial-gradient(circle at 1px 1px, ${strong} 1px, transparent 1.5px)`,
          `radial-gradient(circle at 1px 1px, ${soft} 1px, transparent 1.5px)`,
          `radial-gradient(circle at 1px 1px, ${faint} 1px, transparent 1.5px)`,
        ].join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px, ${safeSize * 1.5}px ${safeSize * 1.5}px, ${safeSize * 1.25}px ${safeSize * 1.25}px`,
        backgroundPosition: `0 0, ${safeSize / 2}px ${safeSize / 2}px, ${safeSize * 0.75}px ${safeSize * 0.25}px`,
      }

    case "striped-grid-spotlight":
      return {
        backgroundImage: [
          `linear-gradient(90deg, ${soft} ${line}, transparent ${line})`,
          `linear-gradient(180deg, ${soft} ${line}, transparent ${line})`,
          `repeating-linear-gradient(45deg, ${faint} 0 2px, transparent 2px 6px)`,
        ].join(", "),
        backgroundSize: `${safeSize}px ${safeSize}px`,
        ...maskStyle(
          "radial-gradient(circle at 50% 50%, black 0, transparent 38%)",
        ),
      }

    default:
      return {}
  }
}
