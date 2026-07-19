import {
  compose,
  identity,
  rotateDEG,
  scale,
  translate,
  skew,
  decomposeTSR,
  fromTransformAttribute,
  type Matrix,
} from "transformation-matrix"
import { Matrix6 } from "./types"

export type { Matrix }
export { translate, rotateDEG, scale, identity }

const RAD_TO_DEG = 180 / Math.PI
const DEG_TO_RAD = Math.PI / 180

// The library's descriptor union types are incomplete (rotate lacks cx/cy,
// matrix lacks a..f in the union). Widen for property access.
type TransformDescriptor = {
  type: string
  tx?: number
  ty?: number
  sx?: number
  sy?: number
  angle?: number
  cx?: number
  cy?: number
  a?: number
  b?: number
  c?: number
  d?: number
  e?: number
  f?: number
}

// Parse a transform attribute string into a single composed matrix.
// Returns identity on empty/invalid input.
export function parseTransform(value: string | undefined | null): Matrix {
  if (!value || value.trim() === "") return identity()
  let descriptors: TransformDescriptor[]
  try {
    descriptors = fromTransformAttribute(value) as unknown as TransformDescriptor[]
  } catch {
    return identity()
  }

  const matrices: Matrix[] = []
  for (const d of descriptors) {
    switch (d.type) {
      case "translate":
        matrices.push(translate(d.tx ?? 0, d.ty ?? 0))
        break
      case "scale":
        matrices.push(scale(d.sx ?? 1, d.sy ?? d.sx ?? 1))
        break
      case "rotate": {
        const angle = d.angle ?? 0
        const cx = d.cx ?? 0
        const cy = d.cy ?? 0
        // rotate(angle, cx, cy) == translate(cx,cy) rotate translate(-cx,-cy)
        if (cx !== 0 || cy !== 0) {
          matrices.push(
            compose(translate(cx, cy), rotateDEG(angle), translate(-cx, -cy)),
          )
        } else {
          matrices.push(rotateDEG(angle))
        }
        break
      }
      case "skewX":
        matrices.push(skew((d.angle ?? 0) * DEG_TO_RAD, 0))
        break
      case "skewY":
        matrices.push(skew(0, (d.angle ?? 0) * DEG_TO_RAD))
        break
      case "matrix":
        matrices.push({
          a: d.a ?? 1,
          b: d.b ?? 0,
          c: d.c ?? 0,
          d: d.d ?? 1,
          e: d.e ?? 0,
          f: d.f ?? 0,
        })
        break
      default:
        break
    }
  }

  if (matrices.length === 0) return identity()
  return compose(...matrices)
}

export function composeMatrix(...matrices: Matrix[]): Matrix {
  if (matrices.length === 0) return identity()
  return compose(...matrices)
}

export const identityMatrix = identity

export function toMatrix6(m: Matrix): Matrix6 {
  return [m.a, m.b, m.c, m.d, m.e, m.f]
}

export interface DecomposedTransform {
  tx: number
  ty: number
  rotation: number // degrees
  scaleX: number
  scaleY: number
  // True when the matrix has shear (non-decomposable to TRS cleanly).
  hasComplexTransform: boolean
}

// A matrix has shear if the two basis vectors aren't orthogonal.
function hasShear(m: Matrix): boolean {
  // dot of column vectors (a,b)·(c,d) after normalizing scale is ~0 for pure TRS
  const dot = m.a * m.c + m.b * m.d
  const s1 = Math.hypot(m.a, m.b)
  const s2 = Math.hypot(m.c, m.d)
  if (s1 === 0 || s2 === 0) return false
  return Math.abs(dot / (s1 * s2)) > 1e-4
}

export function decompose(m: Matrix): DecomposedTransform {
  const tsr = decomposeTSR(m)
  return {
    tx: tsr.translate.tx,
    ty: tsr.translate.ty,
    rotation: tsr.rotation.angle * RAD_TO_DEG,
    scaleX: tsr.scale.sx,
    scaleY: tsr.scale.sy,
    hasComplexTransform: hasShear(m),
  }
}
