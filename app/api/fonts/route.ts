import { NextResponse } from "next/server"
import { FALLBACK_FONTS, type GoogleFont } from "@/lib/fonts"

export const runtime = "nodejs"
// Cache the font list for a day; it changes rarely and is large.
export const revalidate = 86400

type GoogleApiFont = {
  family: string
  category: string
  variants: string[]
  axes?: { tag: string; start: number; end: number }[]
}

type GoogleApiResponse = {
  items?: GoogleApiFont[]
}

// Parse Google's "variants" (e.g. "regular", "700", "italic", "700italic")
// into a sorted, de-duplicated list of numeric weights.
const parseWeights = (variants: string[]): number[] => {
  const weights = new Set<number>()
  for (const variant of variants) {
    if (variant === "regular" || variant === "italic") {
      weights.add(400)
      continue
    }
    const match = variant.match(/^(\d{3})/)
    if (match) weights.add(Number(match[1]))
  }
  const sorted = [...weights].sort((a, b) => a - b)
  return sorted.length > 0 ? sorted : [400]
}

const normalize = (item: GoogleApiFont): GoogleFont => ({
  family: item.family,
  category: item.category ?? "sans-serif",
  weights: parseWeights(item.variants ?? []),
  // A family is "variable" when it exposes a weight axis.
  variable: Boolean(item.axes?.some((axis) => axis.tag === "wght")),
})

// In-memory cache so repeated requests within a server instance skip the fetch.
let cache: { fonts: GoogleFont[]; at: number } | null = null
const CACHE_MS = 1000 * 60 * 60 // 1 hour

// GET /api/fonts -> { fonts: GoogleFont[], source: "google" | "fallback" }
// Returns the metadata list only (no font files); the client lazy-loads the
// actual font faces via the keyless CSS2 API.
export async function GET() {
  if (cache && Date.now() - cache.at < CACHE_MS) {
    return NextResponse.json({ fonts: cache.fonts, source: "google" })
  }

  const key = process.env.GOOGLE_FONTS_API_KEY
  if (!key) {
    return NextResponse.json({ fonts: FALLBACK_FONTS, source: "fallback" })
  }

  try {
    // sort=popularity so the first slice we show the user is the popular set.
    const url = `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`
    const res = await fetch(url, { next: { revalidate } })
    if (!res.ok) throw new Error(`Google Fonts API responded ${res.status}`)

    const data = (await res.json()) as GoogleApiResponse
    const fonts = (data.items ?? []).map(normalize)
    if (fonts.length === 0) throw new Error("Google Fonts API returned no items")

    cache = { fonts, at: Date.now() }
    return NextResponse.json({ fonts, source: "google" })
  } catch (error) {
    console.error("Failed to load Google Fonts list:", error)
    return NextResponse.json({ fonts: FALLBACK_FONTS, source: "fallback" })
  }
}
