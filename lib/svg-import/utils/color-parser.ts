// SVG/CSS color parsing → normalized hex (#rrggbb or #rrggbbaa), plus passthrough
// for special values (`none`, gradient refs). The renderer only needs a usable
// CSS color string or a preserved url(#id) reference.

const NAMED_COLORS: Record<string, string> = {
  transparent: "#00000000",
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  cyan: "#00ffff",
  magenta: "#ff00ff",
  gray: "#808080",
  grey: "#808080",
  silver: "#c0c0c0",
  maroon: "#800000",
  olive: "#808000",
  lime: "#00ff00",
  aqua: "#00ffff",
  teal: "#008080",
  navy: "#000080",
  fuchsia: "#ff00ff",
  purple: "#800080",
  orange: "#ffa500",
  pink: "#ffc0cb",
  brown: "#a52a2a",
  gold: "#ffd700",
  indigo: "#4b0082",
  violet: "#ee82ee",
  crimson: "#dc143c",
  coral: "#ff7f50",
  salmon: "#fa8072",
  khaki: "#f0e68c",
  turquoise: "#40e0d0",
  tan: "#d2b48c",
  beige: "#f5f5dc",
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const toHex2 = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0")

function expandShortHex(hex: string): string {
  // #rgb / #rgba → #rrggbb / #rrggbbaa
  if (hex.length === 4 || hex.length === 5) {
    return (
      "#" +
      hex
        .slice(1)
        .split("")
        .map((c) => c + c)
        .join("")
    )
  }
  return hex
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360
  s = clamp(s, 0, 1)
  l = clamp(l, 0, 1)
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255]
}

export interface ColorParseContext {
  currentColor?: string
}

export interface ParsedColor {
  // Normalized value, or a preserved reference for gradients.
  value: string
  // True when the value is a `url(#id)` reference the renderer must resolve.
  isReference: boolean
}

export function parseColor(
  raw: string | undefined | null,
  ctx: ColorParseContext = {},
): ParsedColor | null {
  if (raw == null) return null
  const value = raw.trim()
  if (value === "") return null

  const lower = value.toLowerCase()

  if (lower === "none") return { value: "none", isReference: false }
  if (lower === "currentcolor") {
    return { value: ctx.currentColor ?? "#000000", isReference: false }
  }
  if (lower === "inherit") return null // caller handles inheritance

  // Gradient / pattern reference: url(#id) — preserved verbatim so it stays
  // unambiguous vs hex colors (both would otherwise start with '#').
  const urlMatch = value.match(/^url\((['"]?)(#[^'")]+)\1\)/i)
  if (urlMatch) {
    return { value: `url(${urlMatch[2]})`, isReference: true }
  }

  if (value.startsWith("#")) {
    const expanded = expandShortHex(value)
    if (/^#([0-9a-f]{6}|[0-9a-f]{8})$/i.test(expanded)) {
      return { value: expanded.toLowerCase(), isReference: false }
    }
    return null
  }

  const rgbMatch = lower.match(/^rgba?\(([^)]+)\)$/)
  if (rgbMatch) {
    const parts = rgbMatch[1].split(",").map((p) => p.trim())
    if (parts.length >= 3) {
      const channel = (p: string) =>
        p.endsWith("%") ? (Number.parseFloat(p) / 100) * 255 : Number.parseFloat(p)
      const r = channel(parts[0])
      const g = channel(parts[1])
      const b = channel(parts[2])
      const a = parts[3] != null ? clamp(Number.parseFloat(parts[3]), 0, 1) : 1
      const base = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`
      return { value: a < 1 ? `${base}${toHex2(a * 255)}` : base, isReference: false }
    }
    return null
  }

  const hslMatch = lower.match(/^hsla?\(([^)]+)\)$/)
  if (hslMatch) {
    const parts = hslMatch[1].split(",").map((p) => p.trim())
    if (parts.length >= 3) {
      const h = Number.parseFloat(parts[0])
      const s = Number.parseFloat(parts[1]) / 100
      const l = Number.parseFloat(parts[2]) / 100
      const a = parts[3] != null ? clamp(Number.parseFloat(parts[3]), 0, 1) : 1
      const [r, g, b] = hslToRgb(h, s, l)
      const base = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`
      return { value: a < 1 ? `${base}${toHex2(a * 255)}` : base, isReference: false }
    }
    return null
  }

  if (NAMED_COLORS[lower]) {
    return { value: NAMED_COLORS[lower], isReference: false }
  }

  return null
}
