import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload"

// POST /api/imgbb/upload
// Free-tier proxy. Uploads a base64 image to imgbb using the app-owned key,
// keeping IMGBB_APP_KEY on the server. Users with their own key upload direct
// from the client and never hit this route.
//
// Body: { image: string (base64, no data-url prefix), name?: string }
// Returns: { url, deleteUrl } on success.
export async function POST(request: NextRequest) {
  const key = process.env.IMG_BB_API
  if (!key) {
    return NextResponse.json(
      { error: "Cloud upload not configured" },
      { status: 500 },
    )
  }

  let body: { image?: unknown; name?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const image = typeof body.image === "string" ? body.image : ""
  const name = typeof body.name === "string" ? body.name : undefined
  if (!image) {
    return NextResponse.json({ error: "Missing image data" }, { status: 400 })
  }

  try {
    const form = new FormData()
    form.append("image", image)
    if (name) form.append("name", name)

    const res = await fetch(`${IMGBB_ENDPOINT}?key=${key}`, {
      method: "POST",
      body: form,
    })

    const json = (await res.json().catch(() => null)) as
      | { data?: { url?: string; delete_url?: string }; success?: boolean }
      | null

    if (!res.ok || !json?.success || !json.data?.url) {
      return NextResponse.json(
        { error: `Upload failed (${res.status})` },
        { status: 502 },
      )
    }

    return NextResponse.json({
      url: json.data.url,
      deleteUrl: json.data.delete_url ?? null,
    })
  } catch (error) {
    console.error("imgbb upload failed:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
