import { create } from "zustand"

export interface GradientDecorationPreset {
  id: string
  name: string
  wrapperClassName: string
  innerStyle: Record<string, string>
  defaultColor: string
}

export const gradientDecorationPresets: GradientDecorationPreset[] = [
  {
    id: "radial-gradient-bg",
    name: "Radial Wash",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#6366f1",
    innerStyle: {
      backgroundImage:
        "radial-gradient(125% 125% at 50% 10%, transparent 32%, rgba(99,102,241,0.16) 58%, rgba(99,102,241,0.72) 100%)",
    },
  },
  {
    id: "purple-radial-bloom",
    name: "Radial Bloom",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#a78bfa",
    innerStyle: {
      backgroundImage:
        "radial-gradient(circle at center, rgba(167,139,250,0.08) 0%, rgba(167,139,250,0.18) 32%, rgba(167,139,250,0.42) 64%, rgba(167,139,250,0.72) 100%)",
    },
  },
  {
    id: "mystic-purple-orb",
    name: "Gradient Orb",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#7c3aed",
    innerStyle: {
      backgroundImage:
        "radial-gradient(circle at 50% 30%, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.2) 28%, rgba(124,58,237,0.42) 55%, rgba(124,58,237,0.7) 78%, rgba(124,58,237,0.88) 100%)",
    },
  },
]

type GradientDecorationStore = {
  presets: GradientDecorationPreset[]
  getById: (id: string) => GradientDecorationPreset | undefined
}

export const useGradientDecorationStore = create<GradientDecorationStore>(() => ({
  presets: gradientDecorationPresets,
  getById: (id) => gradientDecorationPresets.find((preset) => preset.id === id),
}))
