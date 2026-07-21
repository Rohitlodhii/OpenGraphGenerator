import { create } from "zustand"

export interface RadialGlowPreset {
  id: string
  name: string
  wrapperClassName: string
  innerStyle: Record<string, string>
  defaultColor: string
}

export const radialGlowPresets: RadialGlowPreset[] = [
  {
    id: "blue-radial-glow",
    name: "Centered Glow",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#3b82f6",
    innerStyle: {
      backgroundImage:
        "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.42), rgba(59,130,246,0.12) 42%, transparent 72%)",
    },
  },
  {
    id: "golden-horizon",
    name: "Horizon Glow",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#fbbf24",
    innerStyle: {
      backgroundImage:
        "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(251,191,36,0.38), rgba(251,191,36,0.12) 46%, transparent 76%)",
    },
  },
  {
    id: "cosmic-nebula",
    name: "Nebula",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#9333ea",
    innerStyle: {
      backgroundImage: [
        "radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147,51,234,0.26), transparent 58%)",
        "radial-gradient(ellipse 130% 60% at 75% 15%, rgba(147,51,234,0.18), transparent 68%)",
        "radial-gradient(ellipse 80% 90% at 20% 30%, rgba(147,51,234,0.2), transparent 54%)",
        "radial-gradient(ellipse 100% 40% at 60% 70%, rgba(147,51,234,0.14), transparent 48%)",
      ].join(", "),
    },
  },
  {
    id: "stellar-mist",
    name: "Stellar Mist",
    wrapperClassName: "relative h-full w-full",
    defaultColor: "#7c3aed",
    innerStyle: {
      backgroundImage: [
        "radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124,58,237,0.24), transparent 52%)",
        "radial-gradient(ellipse 90% 80% at 85% 25%, rgba(124,58,237,0.16), transparent 62%)",
        "radial-gradient(ellipse 120% 65% at 40% 90%, rgba(124,58,237,0.2), transparent 56%)",
        "radial-gradient(ellipse 100% 45% at 70% 5%, rgba(124,58,237,0.12), transparent 46%)",
        "radial-gradient(ellipse 80% 75% at 90% 80%, rgba(124,58,237,0.18), transparent 58%)",
      ].join(", "),
    },
  },
  {
    id: "aurora-edge-glow",
    name: "Edge Glow",
    wrapperClassName: "relative h-full w-full overflow-hidden",
    defaultColor: "#e2e8f0",
    innerStyle: {
      backgroundImage:
        "radial-gradient(ellipse 50% 100% at 10% 0%, rgba(226,232,240,0.34), rgba(226,232,240,0.1) 48%, transparent 72%)",
    },
  },
]

type RadialGlowStore = {
  presets: RadialGlowPreset[]
  getById: (id: string) => RadialGlowPreset | undefined
}

export const useRadialGlowStore = create<RadialGlowStore>(() => ({
  presets: radialGlowPresets,
  getById: (id) => radialGlowPresets.find((preset) => preset.id === id),
}))
