// Parse SVG numeric attribute values, tolerating units and percentages.

const UNIT_RE = /^([+-]?[\d.]+(?:e[+-]?\d+)?)\s*(px|pt|pc|mm|cm|in|em|ex|%)?$/i

// Point-per-unit conversions relative to CSS px (96dpi baseline).
const UNIT_TO_PX: Record<string, number> = {
  px: 1,
  pt: 96 / 72,
  pc: 16,
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
}

export interface ParseNumberOptions {
  // Reference length for `%` values (e.g. viewport width/height or element bounds).
  percentReference?: number
  fallback?: number
}

export function parseNumber(
  value: string | undefined | null,
  options: ParseNumberOptions = {},
): number {
  const fallback = options.fallback ?? 0
  if (value == null) return fallback
  const trimmed = value.trim()
  if (trimmed === "") return fallback

  const match = trimmed.match(UNIT_RE)
  if (!match) {
    const n = Number.parseFloat(trimmed)
    return Number.isFinite(n) ? n : fallback
  }

  const num = Number.parseFloat(match[1])
  if (!Number.isFinite(num)) return fallback
  const unit = match[2]?.toLowerCase()

  if (!unit) return num
  if (unit === "%") {
    if (options.percentReference == null) return num
    return (num / 100) * options.percentReference
  }
  return num * (UNIT_TO_PX[unit] ?? 1)
}

// Parse a whitespace/comma separated list of numbers (points, dash arrays, etc.).
export function parseNumberList(value: string | undefined | null): number[] {
  if (!value) return []
  return value
    .trim()
    .split(/[\s,]+/)
    .map((v) => Number.parseFloat(v))
    .filter((n) => Number.isFinite(n))
}
