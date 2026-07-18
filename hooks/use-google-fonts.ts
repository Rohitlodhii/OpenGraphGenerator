"use client"

import * as React from "react"
import { FALLBACK_FONTS, type GoogleFont } from "@/lib/fonts"

// Fetches the Google Fonts metadata list a single time and shares it across all
// consumers. Only the list is fetched here — individual font faces are loaded
// lazily elsewhere via lib/font-loader.

type FontsState = {
  fonts: GoogleFont[]
  loading: boolean
  error: boolean
}

let cache: GoogleFont[] | null = null
let inFlight: Promise<GoogleFont[]> | null = null

const fetchFonts = (): Promise<GoogleFont[]> => {
  if (cache) return Promise.resolve(cache)
  if (inFlight) return inFlight

  inFlight = fetch("/api/fonts")
    .then((res) => {
      if (!res.ok) throw new Error(`/api/fonts responded ${res.status}`)
      return res.json()
    })
    .then((data: { fonts?: GoogleFont[] }) => {
      const fonts = data.fonts && data.fonts.length > 0 ? data.fonts : FALLBACK_FONTS
      cache = fonts
      return fonts
    })
    .catch(() => {
      // Never hard-fail the picker; fall back to the bundled list.
      cache = FALLBACK_FONTS
      return FALLBACK_FONTS
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

export function useGoogleFonts(): FontsState {
  const [state, setState] = React.useState<FontsState>(() => ({
    fonts: cache ?? [],
    loading: !cache,
    error: false,
  }))

  React.useEffect(() => {
    if (cache) {
      setState({ fonts: cache, loading: false, error: false })
      return
    }

    let active = true
    fetchFonts().then((fonts) => {
      if (!active) return
      setState({ fonts, loading: false, error: false })
    })

    return () => {
      active = false
    }
  }, [])

  return state
}

// Small debounce hook for the search input so filtering a large list doesn't
// run on every keystroke.
export function useDebouncedValue<T>(value: T, delay = 150): T {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
