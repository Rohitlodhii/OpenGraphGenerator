import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { FREE_LIMIT } from "@/lib/tools-usage"

export const runtime = "nodejs"

// GET /api/user/api-keys
// Returns whether the user has saved their own Illustration / Unsplash keys and
// how many free searches they have left for each source. Never returns the raw
// key values.
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      ownIllustrationApiKey: true,
      ownUnsplashAccessKey: true,
      illustrationSearchCount: true,
      unsplashSearchCount: true,
    },
  })

  return NextResponse.json({
    illustration: {
      connected: Boolean(user?.ownIllustrationApiKey),
      remaining: user?.ownIllustrationApiKey
        ? null
        : Math.max(0, FREE_LIMIT - (user?.illustrationSearchCount ?? 0)),
    },
    unsplash: {
      connected: Boolean(user?.ownUnsplashAccessKey),
      remaining: user?.ownUnsplashAccessKey
        ? null
        : Math.max(0, FREE_LIMIT - (user?.unsplashSearchCount ?? 0)),
    },
    limit: FREE_LIMIT,
  })
}

// POST /api/user/api-keys  { source: "illustration" | "unsplash", key: string | null }
// Saves (or clears, when key is null/empty) the user's own key for a source.
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => null)) as
    | { source?: string; key?: string | null }
    | null
  const source = body?.source
  if (source !== "illustration" && source !== "unsplash") {
    return NextResponse.json({ error: "Invalid source" }, { status: 400 })
  }

  const trimmed = body?.key?.trim() || null
  const field =
    source === "illustration" ? "ownIllustrationApiKey" : "ownUnsplashAccessKey"

  await prisma.user.update({
    where: { id: session.user.id },
    data: { [field]: trimmed },
  })

  return NextResponse.json({ connected: Boolean(trimmed) })
}
