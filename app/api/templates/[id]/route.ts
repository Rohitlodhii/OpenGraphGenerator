import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"

export const runtime = "nodejs"

const TEMPLATES_DIR = path.join(process.cwd(), "templates")

// Only allow safe ids so params can never escape the templates folder.
const isSafeId = (id: string) => /^[a-zA-Z0-9_-]+$/.test(id)

// GET /api/templates/:id -> full stored template (including payload)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!isSafeId(id)) {
    return NextResponse.json({ error: "Invalid template id" }, { status: 400 })
  }

  try {
    const raw = await fs.readFile(path.join(TEMPLATES_DIR, `${id}.json`), "utf-8")
    return NextResponse.json({ template: JSON.parse(raw) })
  } catch {
    return NextResponse.json({ error: "Template not found" }, { status: 404 })
  }
}

// DELETE /api/templates/:id -> remove json + png
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!isSafeId(id)) {
    return NextResponse.json({ error: "Invalid template id" }, { status: 400 })
  }

  try {
    await fs.rm(path.join(TEMPLATES_DIR, `${id}.json`), { force: true })
    await fs.rm(path.join(TEMPLATES_DIR, `${id}.png`), { force: true })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete template:", error)
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
  }
}
