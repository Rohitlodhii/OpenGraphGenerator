import { create } from "zustand"

export type CustomGradientMode = "linear" | "radial"
export type CustomGradientRadialShape = "circle" | "ellipse"

export interface CustomGradientStop {
  id: string
  color: string
  position: number // 0-100, % along the gradient
  opacity: number // 0-100
}

const createStopId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `stop-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

interface CustomGradientState {
  mode: CustomGradientMode
  angle: number // degrees, linear only
  radialShape: CustomGradientRadialShape
  stops: CustomGradientStop[]
  grain: number

  setMode: (mode: CustomGradientMode) => void
  setAngle: (angle: number) => void
  setRadialShape: (shape: CustomGradientRadialShape) => void
  setGrain: (grain: number) => void
  addStop: () => void
  removeStop: (id: string) => void
  updateStop: (id: string, updates: Partial<Omit<CustomGradientStop, "id">>) => void
}

export const useCustomGradientStore = create<CustomGradientState>((set) => ({
  mode: "linear",
  angle: 135,
  radialShape: "circle",
  grain: 0,
  stops: [
    { id: createStopId(), color: "#6366f1", position: 0, opacity: 100 },
    { id: createStopId(), color: "#ec4899", position: 100, opacity: 100 },
  ],

  setMode: (mode) => set({ mode }),
  setAngle: (angle) => set({ angle }),
  setRadialShape: (radialShape) => set({ radialShape }),
  setGrain: (grain) => set({ grain }),

  addStop: () =>
    set((state) => {
      const last = state.stops[state.stops.length - 1]
      const secondLast = state.stops[state.stops.length - 2]
      const position =
        last && secondLast
          ? Math.round((last.position + secondLast.position) / 2)
          : Math.round(((last?.position ?? 0) + 100) / 2)
      return {
        stops: [
          ...state.stops,
          { id: createStopId(), color: "#22d3ee", position, opacity: 100 },
        ],
      }
    }),

  removeStop: (id) =>
    set((state) => ({
      stops: state.stops.length > 2 ? state.stops.filter((stop) => stop.id !== id) : state.stops,
    })),

  updateStop: (id, updates) =>
    set((state) => ({
      stops: state.stops.map((stop) => (stop.id === id ? { ...stop, ...updates } : stop)),
    })),
}))
