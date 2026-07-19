import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const BASE = "https://getillustrations.com/api/v1/plugin"

// A normalized illustration result the client can rely on regardless of the
// exact upstream field names.
type Illustration = {
  id: string
  name: string
  type: string
  thumbnail: string | null
  preview: string | null
  packId: string | null
  svgAvailable: boolean
  hasAccess: boolean
}

// Upstream illustration hit shape (getillustrations.com search endpoint).
const normalizeHit = (
  hit: Record<string, unknown>,
  type: string,
): Illustration | null => {
  const id = (hit.id as string | number) ?? null
  if (id === null || id === undefined) return null

  const pack = hit.pack as Record<string, unknown> | undefined

  return {
    id: String(id),
    name:
      (hit.name as string) ??
      (pack?.name as string) ??
      (hit.tags as string)?.split(",")[0]?.trim() ??
      "Illustration",
    type,
    thumbnail:
      (hit.thumbnailUrl as string) ??
      (hit.imageUrl as string) ??
      null,
    preview: (hit.imageUrl as string) ?? (hit.thumbnailUrl as string) ?? null,
    packId: (hit.packId as string) ?? (pack?.id as string) ?? null,
    svgAvailable: Boolean(hit.svgAvailable),
    hasAccess: Boolean(hit.hasAccess),
  }
}

// GET /api/illustrations/search?q=business
// Proxies the getillustrations.com search endpoint, keeping the API key on the
// server, and returns a normalized { illustrations } list.
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim()
  if (!query) {
    return NextResponse.json({ illustrations: [] })
  }

  const key = process.env.ILLUSTRATION_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Illustration API key not configured" },
      { status: 500 },
    )
  }

  try {
    const url = `${BASE}/search?q=${encodeURIComponent(query)}&limit=40`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `Search failed (${res.status})`, detail: detail.slice(0, 200) },
        { status: res.status },
      )
    }

    const data = (await res.json()) as Record<string, unknown>
    // Real shape: { query, results: { illustrations: [...], icons: [...] } }.
    // Also tolerate flatter shapes in case the endpoint changes.
    const results = (data.results as Record<string, unknown>) ?? data
    const rawIllustrations =
      (results.illustrations as unknown[]) ??
      (data.hits as unknown[]) ??
      (data.data as unknown[]) ??
      []

    const illustrations = (Array.isArray(rawIllustrations) ? rawIllustrations : [])
      .map((hit) => normalizeHit(hit as Record<string, unknown>, "illustration"))
      .filter((item): item is Illustration => item !== null)

    return NextResponse.json({ illustrations })
  } catch (error) {
    console.error("Illustration search failed:", error)
    return NextResponse.json(
      { error: "Illustration search failed" },
      { status: 500 },
    )
  }
}
