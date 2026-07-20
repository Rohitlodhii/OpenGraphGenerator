import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { checkAndConsume, FREE_LIMIT } from "@/lib/tools-usage"

export const runtime = "nodejs"

const BASE = "https://api.unsplash.com"

// A normalized result matching the shape the Tools panel renders for both
// sources (illustration + unsplash).
type UnsplashResult = {
  id: string
  name: string
  type: string
  thumbnail: string | null
  preview: string | null
  packId: string | null
  svgAvailable: boolean
  hasAccess: boolean
}

type UnsplashPhoto = {
  id: string
  description?: string | null
  alt_description?: string | null
  urls?: { thumb?: string; small?: string; regular?: string; full?: string }
  user?: { name?: string }
}

const normalize = (photo: UnsplashPhoto): UnsplashResult | null => {
  if (!photo?.id) return null
  return {
    id: String(photo.id),
    name:
      photo.description?.trim() ||
      photo.alt_description?.trim() ||
      (photo.user?.name ? `Photo by ${photo.user.name}` : "Photo"),
    type: "unsplash",
    thumbnail: photo.urls?.thumb ?? photo.urls?.small ?? null,
    // Preview is what we drop on the canvas — prefer the "regular" size.
    preview: photo.urls?.regular ?? photo.urls?.small ?? photo.urls?.full ?? null,
    packId: null,
    svgAvailable: false,
    hasAccess: true,
  }
}

// GET /api/unsplash/search?q=nature
// Searches Unsplash photos with Client-ID auth, keeping the key server-side.
// Enforces the per-user 5 free searches limit unless the user saved their own key.
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const query = request.nextUrl.searchParams.get("q")?.trim()
  if (!query) {
    return NextResponse.json({ illustrations: [] })
  }

  const limit = await checkAndConsume(session.user.id, "unsplash")
  if (!limit.ok) {
    return NextResponse.json(
      {
        error: `You've used your ${FREE_LIMIT} free Unsplash searches. Add your own Unsplash key in Profile → Connectors to keep searching.`,
        code: "LIMIT_REACHED",
      },
      { status: 402 },
    )
  }

  const key = limit.ownKey ?? process.env.UNSPLASH_ACCESS_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Unsplash API key not configured" },
      { status: 500 },
    )
  }

  try {
    const url = `${BASE}/search/photos?query=${encodeURIComponent(query)}&per_page=30`
    const res = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${key}`,
        "Accept-Version": "v1",
      },
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `Unsplash search failed (${res.status})`, detail: detail.slice(0, 200) },
        { status: res.status },
      )
    }

    const data = (await res.json()) as { results?: UnsplashPhoto[] }
    const illustrations = (Array.isArray(data.results) ? data.results : [])
      .map(normalize)
      .filter((item): item is UnsplashResult => item !== null)

    return NextResponse.json({ illustrations, remaining: limit.remaining })
  } catch (error) {
    console.error("Unsplash search failed:", error)
    return NextResponse.json({ error: "Unsplash search failed" }, { status: 500 })
  }
}
