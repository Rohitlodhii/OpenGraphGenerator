declare module "d-path-parser" {
  interface Point {
    x: number
    y: number
  }
  interface PathCommand {
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
  export default function parse(d: string): PathCommand[]
}
