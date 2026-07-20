// Server-side per-user usage limiting for the Tools panel search sources.
//
// Each user gets FREE_LIMIT free searches per source (illustration, unsplash).
// Once exhausted they must add their own API key (stored on the User row), which
// makes that source unlimited. The counter lives in the DB so it survives
// reloads and is enforced server-side.

import prisma from "@/lib/prisma"

export const FREE_LIMIT = 5

export type ToolSource = "illustration" | "unsplash"

type LimitResult =
  | { ok: true; ownKey: string | null; remaining: number | null }
  | { ok: false; code: "LIMIT_REACHED"; remaining: 0 }

const FIELDS: Record<
  ToolSource,
  { count: "illustrationSearchCount" | "unsplashSearchCount"; key: "ownIllustrationApiKey" | "ownUnsplashAccessKey" }
> = {
  illustration: { count: "illustrationSearchCount", key: "ownIllustrationApiKey" },
  unsplash: { count: "unsplashSearchCount", key: "ownUnsplashAccessKey" },
}

// Checks whether the user may run a search against `source`. When they rely on
// the free tier and still have room, the count is incremented immediately so
// concurrent requests can't overshoot the limit. Returns the user's own key
// (if any) so the caller can prefer it over the shared app key.
export const checkAndConsume = async (
  userId: string,
  source: ToolSource,
): Promise<LimitResult> => {
  const { count, key } = FIELDS[source]

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { [count]: true, [key]: true } as Record<string, true>,
  })

  const ownKey = ((user as Record<string, unknown> | null)?.[key] as string | null) ?? null
  if (ownKey && ownKey.trim()) {
    return { ok: true, ownKey: ownKey.trim(), remaining: null }
  }

  const used = ((user as Record<string, unknown> | null)?.[count] as number | undefined) ?? 0
  if (used >= FREE_LIMIT) {
    return { ok: false, code: "LIMIT_REACHED", remaining: 0 }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { [count]: { increment: 1 } },
  })

  return { ok: true, ownKey: null, remaining: Math.max(0, FREE_LIMIT - used - 1) }
}
