import { applyPayload, buildPayload, type DesignPayload } from "@/lib/design-payload"
import { useCanvasStore } from "@/store/canvasstore"

// Start a fresh project: clear all canvas objects + selection.
export const newProject = () => {
  useCanvasStore.setState({ objects: [], selectedObjectId: null })
}

const STORAGE_KEY = "gg:projects:v1"

export type ProjectSummary = {
  id: string
  name: string
  createdAt: string
}

type LocalProject = ProjectSummary & {
  data: DesignPayload
}

type LocalMap = Record<string, LocalProject>

const isBrowser = () => typeof window !== "undefined"

const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `local-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

const readLocalMap = (): LocalMap => {
  if (!isBrowser()) return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return parsed as LocalMap
  } catch {
    return {}
  }
}

const writeLocalMap = (map: LocalMap) => {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

// ---- Local (signed-out) ----

export const saveLocalProject = (name: string): LocalProject => {
  const map = readLocalMap()
  const project: LocalProject = {
    id: makeId(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    data: buildPayload(),
  }
  map[project.id] = project
  writeLocalMap(map)
  return project
}

// Overwrite an existing local project's data (keeps id + createdAt).
export const updateLocalProject = (id: string, name: string): boolean => {
  const map = readLocalMap()
  const existing = map[id]
  if (!existing) return false
  map[id] = { ...existing, name: name.trim(), data: buildPayload() }
  writeLocalMap(map)
  return true
}

export const listLocalProjects = (): ProjectSummary[] =>
  Object.values(readLocalMap())
    .map(({ id, name, createdAt }) => ({ id, name, createdAt }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export const loadLocalProject = (id: string): { name: string } | null => {
  const project = readLocalMap()[id]
  if (!project) return null
  applyPayload(project.data)
  return { name: project.name }
}

export const deleteLocalProject = (id: string) => {
  const map = readLocalMap()
  delete map[id]
  writeLocalMap(map)
}

export const hasLocalProjects = (): boolean => Object.keys(readLocalMap()).length > 0

// ---- DB (signed-in) ----

export const saveDbProject = async (name: string): Promise<string> => {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim(), data: buildPayload() }),
  })
  if (!res.ok) throw new Error("Failed to save project")
  const { project } = (await res.json()) as { project: { id: string } }
  return project.id
}

// Overwrite an existing DB project's data (keeps id + createdAt).
export const updateDbProject = async (id: string, name: string): Promise<boolean> => {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name.trim(), data: buildPayload() }),
  })
  if (res.status === 404) return false
  if (!res.ok) throw new Error("Failed to update project")
  return true
}

export const listDbProjects = async (): Promise<ProjectSummary[]> => {
  const res = await fetch("/api/projects")
  if (!res.ok) throw new Error("Failed to load projects")
  const { projects } = (await res.json()) as { projects: ProjectSummary[] }
  return projects
}

export const loadDbProject = async (id: string): Promise<{ name: string } | null> => {
  const res = await fetch(`/api/projects/${id}`)
  if (!res.ok) return null
  const { project } = (await res.json()) as { project: { name: string; data: string } }
  const payload = JSON.parse(project.data) as DesignPayload
  applyPayload(payload)
  return { name: project.name }
}

export const deleteDbProject = async (id: string): Promise<void> => {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
  if (!res.ok) throw new Error("Failed to delete project")
}

// Push every local project into the DB, then clear local store.
export const syncLocalToDb = async (): Promise<number> => {
  const map = readLocalMap()
  const entries = Object.values(map)
  for (const project of entries) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: project.name, data: project.data }),
    })
    if (!res.ok) throw new Error("Failed to sync project")
  }
  writeLocalMap({})
  return entries.length
}
