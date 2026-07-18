import { toPng } from "html-to-image"
import { applyPayload, buildPayload, type DesignPayload } from "@/lib/design-payload"
import { useCanvasStore } from "@/store/canvasstore"

export type TemplateSummary = {
  id: string
  name: string
  createdAt: string
  dimensions: { width: number; height: number }
  thumbnailUrl: string
}

type StoredTemplate = {
  id: string
  name: string
  createdAt: string
  dimensions: { width: number; height: number }
  payload: DesignPayload
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

// Renders the current stage to a small PNG data URL for use as a thumbnail.
export const captureThumbnail = async (): Promise<string | undefined> => {
  const stage = document.querySelector(".canvas-stage") as HTMLElement | null
  if (!stage) return undefined

  const { selectedObjectId, setSelectedObjectId } = useCanvasStore.getState()
  try {
    // Hide selection outline/handle so it isn't baked into the thumbnail.
    setSelectedObjectId(null)
    await nextFrame()
    await nextFrame()

    return await toPng(stage, {
      cacheBust: true,
      pixelRatio: 0.4,
    })
  } catch (error) {
    console.error("Failed to capture template thumbnail:", error)
    return undefined
  } finally {
    setSelectedObjectId(selectedObjectId)
  }
}

export const saveTemplate = async (name: string): Promise<TemplateSummary> => {
  const trimmed = name.trim()
  if (!trimmed) throw new Error("Template name is required")

  const payload = buildPayload()
  const thumbnail = await captureThumbnail()

  const response = await fetch("/api/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: trimmed,
      payload,
      dimensions: payload.dimensions,
      thumbnail,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to save template")
  }

  const data = (await response.json()) as { template: TemplateSummary }
  return data.template
}

export const listTemplates = async (): Promise<TemplateSummary[]> => {
  const response = await fetch("/api/templates", { cache: "no-store" })
  if (!response.ok) throw new Error("Failed to load templates")
  const data = (await response.json()) as { templates: TemplateSummary[] }
  return data.templates
}

export const loadTemplate = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/templates/${id}`, { cache: "no-store" })
  if (!response.ok) return false
  const data = (await response.json()) as { template: StoredTemplate }
  applyPayload(data.template.payload)
  return true
}

export const deleteTemplate = async (id: string): Promise<boolean> => {
  const response = await fetch(`/api/templates/${id}`, { method: "DELETE" })
  return response.ok
}
