import type { CustomGradientStop, CustomGradientMode, CustomGradientRadialShape } from "@/store/customgradientstore"

const hexToRgba = (hex: string, opacityPercent: number) => {
  const normalized = hex.replace("#", "")
  const full =
    normalized.length === 3
      ? normalized.split("").map((c) => c + c).join("")
      : normalized
  const r = parseInt(full.slice(0, 2), 16) || 0
  const g = parseInt(full.slice(2, 4), 16) || 0
  const b = parseInt(full.slice(4, 6), 16) || 0
  const a = Math.max(0, Math.min(100, opacityPercent)) / 100
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// Builds a plain CSS gradient string (no canvas needed — this renders
// identically on-canvas and in the exported image).
export const buildCssGradient = (
  mode: CustomGradientMode,
  angle: number,
  radialShape: CustomGradientRadialShape,
  stops: CustomGradientStop[],
) => {
  const sorted = [...stops].sort((a, b) => a.position - b.position)
  const stopsCss = sorted
    .map((stop) => `${hexToRgba(stop.color, stop.opacity)} ${stop.position}%`)
    .join(", ")

  if (mode === "radial") {
    return `radial-gradient(${radialShape} at center, ${stopsCss})`
  }
  return `linear-gradient(${angle}deg, ${stopsCss})`
}
