import { applyPayload, buildPayload, type DesignPayload } from "@/lib/design-payload"

const STORAGE_KEY = "gg:generation-presets:v1"

type StoredPreset = {
  version: 1
  name: string
  createdAt: string
  payload: DesignPayload
}

type PresetMap = Record<string, StoredPreset>

const isBrowser = () => typeof window !== "undefined"

const readPresetMap = (): PresetMap => {
  if (!isBrowser()) return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}
    return parsed as PresetMap
  } catch {
    return {}
  }
}

const writePresetMap = (map: PresetMap) => {
  if (!isBrowser()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export const saveGenerationPreset = (name: string) => {
  const trimmedName = name.trim()
  if (!trimmedName) return

  const map = readPresetMap()
  map[trimmedName] = {
    version: 1,
    name: trimmedName,
    createdAt: new Date().toISOString(),
    payload: buildPayload(),
  }
  writePresetMap(map)
}

export const listGenerationPresets = () => {
  const map = readPresetMap()
  return Object.values(map).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const loadGenerationPreset = (name: string) => {
  const map = readPresetMap()
  const preset = map[name]
  if (!preset) return false

  applyPayload(preset.payload)
  return true
}
