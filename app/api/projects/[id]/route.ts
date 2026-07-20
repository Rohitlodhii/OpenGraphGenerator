import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

// GET /api/projects/:id -> full project incl. data blob
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ project })
}

// PUT /api/projects/:id -> update an existing project (name + data)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as { name?: string; data?: unknown }
  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 })
  }
  if (body.data === undefined || body.data === null) {
    return NextResponse.json({ error: "Project data is required" }, { status: 400 })
  }

  const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data)

  const result = await prisma.project.updateMany({
    where: { id, userId: session.user.id },
    data: { name, data },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ project: { id, name } })
}

// DELETE /api/projects/:id
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const result = await prisma.project.deleteMany({
    where: { id, userId: session.user.id },
  })

  if (result.count === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
