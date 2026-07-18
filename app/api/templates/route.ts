import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "node:fs"
import path from "node:path"

export const runtime = "nodejs"

const TEMPLATES_DIR = path.join(process.cwd(), "templates")

type StoredTemplate = {
  id: string
  name: string
  createdAt: string
  dimensions: { width: number; height: number }
  payload: unknown
}

const ensureDir = async () => {
  await fs.mkdir(TEMPLATES_DIR, { recursive: true })
}

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `tpl-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

// GET /api/templates -> summary list (newest first)
export async function GET() {
  try {
    await ensureDir()
    const files = await fs.readdir(TEMPLATES_DIR)
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    const templates = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const raw = await fs.readFile(path.join(TEMPLATES_DIR, file), "utf-8")
          const parsed = JSON.parse(raw) as StoredTemplate
          return {
            id: parsed.id,
            name: parsed.name,
            createdAt: parsed.createdAt,
            dimensions: parsed.dimensions,
            thumbnailUrl: `/api/templates/${parsed.id}/thumbnail`,
          }
        } catch {
          return null
        }
      }),
    )

    const list = templates
      .filter((template): template is NonNullable<typeof template> => template !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    return NextResponse.json({ templates: list })
  } catch (error) {
    console.error("Failed to list templates:", error)
    return NextResponse.json({ error: "Failed to list templates" }, { status: 500 })
  }
}

// POST /api/templates -> save a new template (json + png thumbnail)
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string
      payload?: unknown
      dimensions?: { width: number; height: number }
      thumbnail?: string
    }

    const name = body.name?.trim()
    if (!name) {
      return NextResponse.json({ error: "Template name is required" }, { status: 400 })
    }
    if (!body.payload) {
      return NextResponse.json({ error: "Template payload is required" }, { status: 400 })
    }

    await ensureDir()

    const id = makeId()
    const createdAt = new Date().toISOString()
    const dimensions = body.dimensions ?? { width: 1200, height: 630 }

    const stored: StoredTemplate = {
      id,
      name,
      createdAt,
      dimensions,
      payload: body.payload,
    }

    await fs.writeFile(
      path.join(TEMPLATES_DIR, `${id}.json`),
      JSON.stringify(stored, null, 2),
      "utf-8",
    )

    // Decode the data URL thumbnail (if provided) and write the PNG.
    if (body.thumbnail && body.thumbnail.startsWith("data:")) {
      const base64 = body.thumbnail.split(",")[1] ?? ""
      if (base64) {
        await fs.writeFile(path.join(TEMPLATES_DIR, `${id}.png`), Buffer.from(base64, "base64"))
      }
    }

    return NextResponse.json({
      template: {
        id,
        name,
        createdAt,
        dimensions,
        thumbnailUrl: `/api/templates/${id}/thumbnail`,
      },
    })
  } catch (error) {
    console.error("Failed to save template:", error)
    return NextResponse.json({ error: "Failed to save template" }, { status: 500 })
  }
}
