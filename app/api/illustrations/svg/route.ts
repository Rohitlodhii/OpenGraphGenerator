import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const BASE = "https://getillustrations.com/api/v1/plugin"

// GET /api/illustrations/svg?type=illustration&id=abc123
// Returns { svg } — the raw inline SVG markup for the asset, fetched with the
// server-side API key so it can be embedded directly onto the canvas.
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type") ?? "illustration"
  const id = request.nextUrl.searchParams.get("id")?.trim()
  if (!id) {
    return NextResponse.json({ error: "Missing asset id" }, { status: 400 })
  }

  const key = process.env.ILLUSTRATION_API_KEY
  if (!key) {
    return NextResponse.json(
      { error: "Illustration API key not configured" },
      { status: 500 },
    )
  }

  try {
    const url = `${BASE}/svg/${encodeURIComponent(type)}/${encodeURIComponent(id)}?json=true`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}` },
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      return NextResponse.json(
        { error: `SVG fetch failed (${res.status})`, detail: detail.slice(0, 200) },
        { status: res.status },
      )
    }

    const contentType = res.headers.get("content-type") ?? ""
    // The endpoint returns raw SVG by default and a JSON wrapper with ?json=true.
    if (contentType.includes("application/json")) {
      const data = (await res.json()) as Record<string, unknown>
      const svg =
        (data.svg_inline as string) ??
        (data.svg as string) ??
        null
      if (svg) return NextResponse.json({ svg })
      // Fall back to a hosted URL if inline markup isn't available.
      return NextResponse.json({
        svg: null,
        svgUrl: (data.svg_url as string) ?? null,
      })
    }

    const svg = await res.text()
    return NextResponse.json({ svg })
  } catch (error) {
    console.error("Illustration SVG fetch failed:", error)
    return NextResponse.json(
      { error: "Illustration SVG fetch failed" },
      { status: 500 },
    )
  }
}
