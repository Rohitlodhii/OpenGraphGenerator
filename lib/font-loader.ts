"use client"

import { buildFontCssUrl, type GoogleFont } from "@/lib/fonts"

// Dynamically loads Google Font faces on demand and caches them in memory so a
// given family is only ever fetched once per session.

type LoadState = "loading" | "loaded" | "error"

const states = new Map<string, LoadState>()
const promises = new Map<string, Promise<void>>()
const listeners = new Set<() => void>()

const notify = () => {
  for (const listener of listeners) listener()
}

export const getFontState = (family: string): LoadState | undefined =>
  states.get(family)

export const isFontLoaded = (family: string): boolean =>
  states.get(family) === "loaded"

// Subscribe to load-state changes (used by useSyncExternalStore in the hook).
export const subscribeFontState = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Inject (once) a <link rel="stylesheet"> for the family and resolve when the
// browser reports the font is ready. Repeat calls for the same family return
// the cached promise instead of adding another <link>. An explicit href may be
// supplied (used by the by-family path); otherwise the CSS2 URL is derived from
// the font metadata.
export function loadFont(font: GoogleFont, href?: string): Promise<void> {
  const family = font.family

  const existing = promises.get(family)
  if (existing) return existing

  if (typeof document === "undefined") return Promise.resolve()

  states.set(family, "loading")
  notify()

  const stylesheet = href ?? buildFontCssUrl(font)
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = stylesheet
  link.dataset.googleFont = family

  const promise = new Promise<void>((resolve) => {
    const settle = (state: LoadState) => {
      states.set(family, state)
      notify()
      resolve()
    }

    link.onload = () => {
      // Ask the Font Loading API to actually fetch the face so previews using
      // it don't flash the fallback. Non-fatal if unsupported.
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts
          .load(`16px "${family}"`)
          .then(() => settle("loaded"))
          .catch(() => settle("loaded"))
      } else {
        settle("loaded")
      }
    }
    link.onerror = () => settle("error")
  })

  document.head.appendChild(link)
  promises.set(family, promise)
  return promise
}

// Load a font when all we have is the family name (e.g. canvas text restored
// from a saved template). Uses the legacy CSS v1 API, which gracefully ignores
// weights a static family doesn't provide. De-duplicates against loadFont()
// via the shared family-keyed cache.
export function loadFontByFamily(family: string): Promise<void> {
  const trimmed = family.trim()
  if (!trimmed) return Promise.resolve()
  if (promises.has(trimmed)) return promises.get(trimmed) as Promise<void>

  const spec = trimmed.replace(/\s+/g, "+")
  const href = `https://fonts.googleapis.com/css?family=${spec}:400,500,600,700&display=swap`

  return loadFont(
    { family: trimmed, category: "sans-serif", weights: [400], variable: false },
    href,
  )
}
