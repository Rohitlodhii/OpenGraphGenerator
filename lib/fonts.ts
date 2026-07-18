// Shared Google Fonts types + helpers used by both the server list route and
// the client-side dynamic loader.

export type GoogleFont = {
  family: string
  category: string
  // Sorted list of available weights, e.g. [400, 700]. Empty => treat as [400].
  weights: number[]
  // True when the family exposes a weight axis (variable font). Lets us request
  // a single weight range instead of many separate static weights.
  variable: boolean
}

// A small, dependency-free fallback so the UI still works before/without the
// Google Fonts API key. These are all real Google Font families.
export const FALLBACK_FONTS: GoogleFont[] = [
  { family: "Poppins", category: "sans-serif", weights: [400, 500, 600, 700], variable: false },
  { family: "Inter", category: "sans-serif", weights: [400, 500, 600, 700], variable: true },
  { family: "Roboto", category: "sans-serif", weights: [400, 500, 700], variable: false },
  { family: "Open Sans", category: "sans-serif", weights: [400, 600, 700], variable: true },
  { family: "Montserrat", category: "sans-serif", weights: [400, 500, 600, 700], variable: true },
  { family: "Lato", category: "sans-serif", weights: [400, 700], variable: false },
  { family: "Oswald", category: "sans-serif", weights: [400, 500, 700], variable: true },
  { family: "Raleway", category: "sans-serif", weights: [400, 600, 700], variable: true },
  { family: "Nunito", category: "sans-serif", weights: [400, 600, 700], variable: true },
  { family: "Playfair Display", category: "serif", weights: [400, 500, 700], variable: true },
  { family: "Merriweather", category: "serif", weights: [400, 700], variable: false },
  { family: "Roboto Slab", category: "serif", weights: [400, 500, 700], variable: true },
  { family: "Lora", category: "serif", weights: [400, 500, 700], variable: true },
  { family: "PT Serif", category: "serif", weights: [400, 700], variable: false },
  { family: "Bebas Neue", category: "display", weights: [400], variable: false },
  { family: "Anton", category: "sans-serif", weights: [400], variable: false },
  { family: "Dancing Script", category: "handwriting", weights: [400, 700], variable: true },
  { family: "Pacifico", category: "handwriting", weights: [400], variable: false },
  { family: "Caveat", category: "handwriting", weights: [400, 700], variable: true },
  { family: "Source Code Pro", category: "monospace", weights: [400, 500, 700], variable: true },
  { family: "JetBrains Mono", category: "monospace", weights: [400, 700], variable: true },
  { family: "Fira Code", category: "monospace", weights: [400, 500, 700], variable: true },
]

// Build a Google Fonts CSS2 stylesheet URL for a family. Requires no API key.
// Uses a weight range for variable fonts (one request covers all weights) and
// an explicit weight list for static fonts.
export function buildFontCssUrl(font: GoogleFont): string {
  const family = font.family.trim().replace(/\s+/g, "+")

  let spec: string
  if (font.variable && font.weights.length > 0) {
    const min = font.weights[0]
    const max = font.weights[font.weights.length - 1]
    spec = min === max ? `${family}:wght@${min}` : `${family}:wght@${min}..${max}`
  } else if (font.weights.length > 0) {
    spec = `${family}:wght@${font.weights.join(";")}`
  } else {
    spec = family
  }

  return `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
}

// CSS font-family value with an appropriate generic fallback.
export function toFontFamilyValue(font: Pick<GoogleFont, "family" | "category">): string {
  const generic =
    font.category === "serif"
      ? "serif"
      : font.category === "monospace"
        ? "monospace"
        : font.category === "handwriting" || font.category === "display"
          ? "cursive"
          : "sans-serif"
  return `'${font.family}', ${generic}`
}

// Extract the raw family name back out of a stored fontFamily CSS value, e.g.
// "'Playfair Display', serif" -> "Playfair Display".
export function familyNameFromValue(value: string | undefined): string | null {
  if (!value) return null
  const first = value.split(",")[0]?.trim()
  if (!first) return null
  return first.replace(/^['"]|['"]$/g, "")
}
