import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"

export const runtime = "nodejs"

const TEMPLATES_DIR = path.join(process.cwd(), "templates")

const isSafeId = (id: string) => /^[a-zA-Z0-9_-]+$/.test(id)

// GET /api/templates/:id/thumbnail -> the template's PNG thumbnail
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!isSafeId(id)) {
    return NextResponse.json({ error: "Invalid template id" }, { status: 400 })
  }

  try {
    const file = await fs.readFile(path.join(TEMPLATES_DIR, `${id}.png`))
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return NextResponse.json({ error: "Thumbnail not found" }, { status: 404 })
  }
}
