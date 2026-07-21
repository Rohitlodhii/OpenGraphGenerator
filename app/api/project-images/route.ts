import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { storageService } from "@/services/storage.service"
import { StorageServiceError } from "@/types/storage"

export const runtime = "nodejs"

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const projectId = formData.get("projectId")
  const objectId = formData.get("objectId")
  const file = formData.get("file")

  if (
    typeof projectId !== "string" ||
    typeof objectId !== "string" ||
    !(file instanceof File)
  ) {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 })
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images are allowed" }, { status: 415 })
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Images larger than 5 MB are local-only" },
      { status: 413 },
    )
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
    select: { id: true },
  })
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  try {
    const result = await storageService.upload({
      bucket: process.env.SUPABASE_STORAGE_BUCKET ?? "uploads",
      folder: `${session.user.id}/${projectId}/${objectId}`,
      file,
    })

    return NextResponse.json({
      ...result,
      url: result.publicUrl,
    })
  } catch (error) {
    const status =
      error instanceof StorageServiceError &&
      error.operation === "configuration"
        ? 503
        : 502
    return NextResponse.json(
      {
        error:
          error instanceof StorageServiceError
            ? error.message
            : "Image upload failed.",
      },
      { status },
    )
  }
}
