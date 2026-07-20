import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"

// GET /api/projects -> current user's saved projects (newest first, no data blob)
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ projects })
}

// POST /api/projects -> save a new project
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as { name?: string; data?: unknown }
  const name = body.name?.trim()
  if (!name) {
    return NextResponse.json({ error: "Project name is required" }, { status: 400 })
  }
  if (body.data === undefined || body.data === null) {
    return NextResponse.json({ error: "Project data is required" }, { status: 400 })
  }

  const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data)

  const project = await prisma.project.create({
    data: { name, data, userId: session.user.id },
    select: { id: true, name: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ project })
}
