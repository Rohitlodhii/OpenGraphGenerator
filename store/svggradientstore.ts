
import { svgPaths } from '@/data/svgpaths'
import { create } from 'zustand'

export type SvgPathItem = {
  d: string
  fill: string
}

export type SvgGradientState = {
  pathsIndex: number
  visible: boolean
  fills: string[]
  blur: number
  grain: number
  backgroundColor: string
  offsetX: number
  offsetY: number
  setIndex: (i: number) => void
  setVisible: (v: boolean) => void
  setFill: (index: number, fill: string) => void
  setFills: (fills: string[]) => void
  setBlur: (blur: number) => void
  setGrain: (grain: number) => void
  setBackgroundColor: (color: string) => void
  setOffsetX: (x: number) => void
  setOffsetY: (y: number) => void
  reset: () => void
}

const initialFills = (svgPaths[0]?.paths || []).map((p) => p.fill)

const useSvgGradientStore = create<SvgGradientState>((set) => ({
  pathsIndex: 0,
  visible: true,
  fills: initialFills,
  blur: 50,
  grain: 0,
  backgroundColor: '#ffffff',
  offsetX: 0,
  offsetY: 0,
  setIndex: (i) => set({ 
    pathsIndex: i,
    fills: (svgPaths[i]?.paths || []).map((p) => p.fill)
  }),
  setVisible: (v) => set({ visible: v }),
  setFill: (index, fill) =>
    set((s) => {
      const fills = [...s.fills]
      fills[index] = fill
      return { fills }
    }),
  setFills: (fills) => set({ fills }),
  setBlur: (blur) => set({ blur }),
  setGrain: (grain) => set({ grain }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),
  setOffsetX: (x) => set({ offsetX: x }),
  setOffsetY: (y) => set({ offsetY: y }),
  reset: () => set({ pathsIndex: 0, visible: true, fills: initialFills, blur: 50, grain: 0, backgroundColor: '#ffffff', offsetX: 0, offsetY: 0 }),
}))

export default useSvgGradientStore
