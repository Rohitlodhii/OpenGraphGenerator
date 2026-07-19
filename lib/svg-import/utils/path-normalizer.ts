import dPathParser from "d-path-parser"
import { PathCommand, Point } from "../types"

// d-path-parser command shapes (from runtime inspection):
//   M/L/T: { code, relative, end:{x,y} }
//   C:     { code, relative, cp1, cp2, end }
//   S/Q:   { code, relative, cp, end }
//   A:     { code, relative, radii:{x,y}, rotation, large, clockwise, end }
//   H:     { code, relative, value }
//   V:     { code, relative, value }
//   Z:     { code }

type RawCmd = {
  code: string
  relative?: boolean
  end?: Point
  cp?: Point
  cp1?: Point
  cp2?: Point
  radii?: Point
  rotation?: number
  large?: boolean
  clockwise?: boolean
  value?: number
}

const addP = (a: Point, b: Point): Point => ({ x: a.x + b.x, y: a.y + b.y })

// Parse a path `d` string and convert all commands to absolute coordinates.
export function normalizePath(d: string): {
  commands: PathCommand[]
  absoluteD: string
} {
  let raw: RawCmd[]
  try {
    raw = dPathParser(d) as RawCmd[]
  } catch {
    return { commands: [], absoluteD: "" }
  }

  const out: RawCmd[] = []
  let cur: Point = { x: 0, y: 0 } // current point
  let start: Point = { x: 0, y: 0 } // subpath start (for Z)

  for (const cmd of raw) {
    const rel = !!cmd.relative
    const code = cmd.code.toUpperCase()

    switch (code) {
      case "M": {
        const end = rel && cmd.end ? addP(cur, cmd.end) : cmd.end!
        cur = end
        start = end
        out.push({ code: "M", relative: false, end })
        break
      }
      case "L":
      case "T": {
        const end = rel && cmd.end ? addP(cur, cmd.end) : cmd.end!
        cur = end
        out.push({ code, relative: false, end })
        break
      }
      case "H": {
        const nx = rel ? cur.x + (cmd.value ?? 0) : cmd.value ?? 0
        cur = { x: nx, y: cur.y }
        out.push({ code: "H", relative: false, value: nx })
        break
      }
      case "V": {
        const ny = rel ? cur.y + (cmd.value ?? 0) : cmd.value ?? 0
        cur = { x: cur.x, y: ny }
        out.push({ code: "V", relative: false, value: ny })
        break
      }
      case "C": {
        const cp1 = rel && cmd.cp1 ? addP(cur, cmd.cp1) : cmd.cp1!
        const cp2 = rel && cmd.cp2 ? addP(cur, cmd.cp2) : cmd.cp2!
        const end = rel && cmd.end ? addP(cur, cmd.end) : cmd.end!
        cur = end
        out.push({ code: "C", relative: false, cp1, cp2, end })
        break
      }
      case "S":
      case "Q": {
        const cp = rel && cmd.cp ? addP(cur, cmd.cp) : cmd.cp!
        const end = rel && cmd.end ? addP(cur, cmd.end) : cmd.end!
        cur = end
        out.push({ code, relative: false, cp, end })
        break
      }
      case "A": {
        const end = rel && cmd.end ? addP(cur, cmd.end) : cmd.end!
        cur = end
        out.push({
          code: "A",
          relative: false,
          radii: cmd.radii,
          rotation: cmd.rotation,
          large: cmd.large,
          clockwise: cmd.clockwise,
          end,
        })
        break
      }
      case "Z": {
        cur = start
        out.push({ code: "Z", relative: false })
        break
      }
      default:
        break
    }
  }

  return { commands: out as unknown as PathCommand[], absoluteD: serializePath(out) }
}

// Serialize absolute commands back to a path `d` string.
export function serializePath(commands: RawCmd[]): string {
  const n = (v: number) => (Number.isInteger(v) ? String(v) : Number(v.toFixed(3)).toString())
  const parts: string[] = []
  for (const c of commands) {
    switch (c.code) {
      case "M":
      case "L":
      case "T":
        parts.push(`${c.code}${n(c.end!.x)} ${n(c.end!.y)}`)
        break
      case "H":
        parts.push(`H${n(c.value ?? 0)}`)
        break
      case "V":
        parts.push(`V${n(c.value ?? 0)}`)
        break
      case "C":
        parts.push(
          `C${n(c.cp1!.x)} ${n(c.cp1!.y)} ${n(c.cp2!.x)} ${n(c.cp2!.y)} ${n(c.end!.x)} ${n(c.end!.y)}`,
        )
        break
      case "S":
      case "Q":
        parts.push(`${c.code}${n(c.cp!.x)} ${n(c.cp!.y)} ${n(c.end!.x)} ${n(c.end!.y)}`)
        break
      case "A":
        parts.push(
          `A${n(c.radii!.x)} ${n(c.radii!.y)} ${n(c.rotation ?? 0)} ${c.large ? 1 : 0} ${c.clockwise ? 1 : 0} ${n(c.end!.x)} ${n(c.end!.y)}`,
        )
        break
      case "Z":
        parts.push("Z")
        break
    }
  }
  return parts.join(" ")
}
