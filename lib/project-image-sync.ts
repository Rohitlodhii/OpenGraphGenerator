"use client"

import { getLocalImageBlob } from "@/lib/local-image-assets"
import { updateDbProject } from "@/lib/projects"
import type { DesignPayload } from "@/lib/design-payload"
import { useCanvasStore } from "@/store/canvasstore"
import { toastManager } from "@/components/ui/toast"

export const MAX_SERVER_IMAGE_BYTES = 5 * 1024 * 1024

type PendingImage = {
  id: string
  fileName: string
  mimeType: string
  blob: Blob
}

const projectSyncVersions = new Map<string, number>()

export const syncProjectImagesInBackground = async (
  projectId: string,
  projectName: string,
  savedPayload: DesignPayload,
) => {
  const syncVersion = (projectSyncVersions.get(projectId) ?? 0) + 1
  projectSyncVersions.set(projectId, syncVersion)
  const objects = savedPayload.canvas.objects
  const localImages = objects.filter(
    (object) =>
      object.type === "image" &&
      object.imageAssetId &&
      !object.imageRemoteUrl,
  )
  if (localImages.length === 0) return

  const resolved = await Promise.all(
    localImages.map(async (object) => {
      const blob = await getLocalImageBlob(
        object.imageAssetId as string,
      ).catch(() => null)
      return { object, blob }
    }),
  )
  const oversized = resolved.filter(
    ({ object, blob }) =>
      (object.imageFileSize ?? blob?.size ?? 0) > MAX_SERVER_IMAGE_BYTES,
  )
  const pending: PendingImage[] = resolved
    .filter(
      ({ object, blob }) =>
        blob &&
        (object.imageFileSize ?? blob.size) <= MAX_SERVER_IMAGE_BYTES,
    )
    .map(({ object, blob }) => ({
      id: object.id,
      fileName: object.imageFileName ?? `${object.id}.png`,
      mimeType: object.imageMimeType || blob?.type || "image/png",
      blob: blob as Blob,
    }))

  if (oversized.length > 0) {
    toastManager.add({
      type: "warning",
      title: `${oversized.length} image${oversized.length === 1 ? "" : "s"} kept locally`,
      description: "Files over 5 MB are not uploaded to Supabase.",
      timeout: 7000,
    })
  }
  if (pending.length === 0) return

  const toastId = toastManager.add({
    type: "loading",
    title: "Uploading images",
    description: `0 of ${pending.length} uploaded`,
    timeout: 0,
  })
  let uploaded = 0
  let failed = 0
  const uploadedUrls = new Map<string, string>()

  for (const image of pending) {
    try {
      const file = new File([image.blob], image.fileName, {
        type: image.mimeType,
      })
      const formData = new FormData()
      formData.set("projectId", projectId)
      formData.set("objectId", image.id)
      formData.set("file", file)
      const response = await fetch("/api/project-images", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error("upload")
      const { url } = (await response.json()) as { url: string }
      uploadedUrls.set(image.id, url)
      const currentObject = useCanvasStore
        .getState()
        .objects.find((object) => object.id === image.id)
      if (
        currentObject?.type === "image" &&
        currentObject.imageAssetId ===
          objects.find((object) => object.id === image.id)?.imageAssetId
      ) {
        useCanvasStore.getState().updateObject(image.id, {
          src: url,
          imageRemoteUrl: url,
        })
      }
      uploaded += 1
    } catch {
      failed += 1
    }

    toastManager.update(toastId, {
      description: `${uploaded + failed} of ${pending.length} processed`,
    })
  }

  if (
    uploaded > 0 &&
    projectSyncVersions.get(projectId) === syncVersion
  ) {
    try {
      const syncedPayload: DesignPayload = {
        ...savedPayload,
        canvas: {
          ...savedPayload.canvas,
          objects: savedPayload.canvas.objects.map((object) => {
            const url = uploadedUrls.get(object.id)
            return url
              ? { ...object, src: url, imageRemoteUrl: url }
              : object
          }),
        },
      }
      const updated = await updateDbProject(
        projectId,
        projectName,
        syncedPayload,
      )
      if (!updated) throw new Error("project missing")
    } catch {
      failed += uploaded
      uploaded = 0
    }
  }

  toastManager.update(toastId, {
    type: failed > 0 ? "warning" : "success",
    title:
      failed > 0
        ? `${uploaded} uploaded, ${failed} failed`
        : "Images uploaded",
    description:
      failed > 0
        ? "Local copies remain available in this browser."
        : `${uploaded} image${uploaded === 1 ? "" : "s"} synced to Supabase.`,
    timeout: 6000,
  })
}
