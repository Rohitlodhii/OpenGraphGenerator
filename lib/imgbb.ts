// imgbb cloud-upload helper. All client-side; the user's own API key and the
// free-tier upload count live in localStorage only — never sent to our DB.
//
// Two paths:
//  - User saved their own imgbb key (Connectors tab): upload direct to imgbb,
//    their quota, no free-tier limit.
//  - No own key: proxy through /api/imgbb/upload (app key) with a soft client
//    limit of FREE_LIMIT uploads.

const KEY_STORAGE = "gg:connector:imgbb:v1"
const UPLOADS_STORAGE = "gg:imgbb:uploads:v1"

export const FREE_LIMIT = 5

const IMGBB_ENDPOINT = "https://api.imgbb.com/1/upload"

const isBrowser = () => typeof window !== "undefined"

// --- own API key -----------------------------------------------------------

export const getImgbbKey = (): string | null => {
  if (!isBrowser()) return null
  return window.localStorage.getItem(KEY_STORAGE)
}

export const setImgbbKey = (key: string) => {
  if (!isBrowser()) return
  const trimmed = key.trim()
  if (!trimmed) return
  window.localStorage.setItem(KEY_STORAGE, trimmed)
}

export const clearImgbbKey = () => {
  if (!isBrowser()) return
  window.localStorage.removeItem(KEY_STORAGE)
}

export const hasImgbbKey = () => !!getImgbbKey()

// --- free-tier upload count ------------------------------------------------

type UploadRecord = { url: string; deleteUrl: string | null; time: string }
type UploadStore = { count: number; images: UploadRecord[] }

const readUploads = (): UploadStore => {
  if (!isBrowser()) return { count: 0, images: [] }
  try {
    const raw = window.localStorage.getItem(UPLOADS_STORAGE)
    if (!raw) return { count: 0, images: [] }
    const parsed = JSON.parse(raw) as Partial<UploadStore>
    return {
      count: typeof parsed.count === "number" ? parsed.count : 0,
      images: Array.isArray(parsed.images) ? parsed.images : [],
    }
  } catch {
    return { count: 0, images: [] }
  }
}

const writeUploads = (store: UploadStore) => {
  if (!isBrowser()) return
  window.localStorage.setItem(UPLOADS_STORAGE, JSON.stringify(store))
}

export const getFreeUploadCount = () => readUploads().count

// Free uploads remaining. Returns Infinity when the user has their own key.
export const freeUploadsRemaining = () =>
  hasImgbbKey() ? Infinity : Math.max(0, FREE_LIMIT - getFreeUploadCount())

const recordUpload = (record: UploadRecord, countsAgainstFree: boolean) => {
  const store = readUploads()
  store.images.unshift(record)
  if (countsAgainstFree) store.count += 1
  writeUploads(store)
}

// --- upload ----------------------------------------------------------------

// Strip the `data:image/png;base64,` prefix imgbb doesn't want.
const toBase64 = (dataUrl: string) => dataUrl.replace(/^data:[^;]+;base64,/, "")

export type UploadResult = { url: string; deleteUrl: string | null }

export class FreeLimitReachedError extends Error {
  constructor() {
    super("Free upload limit reached")
    this.name = "FreeLimitReachedError"
  }
}

// Upload a raster dataURL to imgbb. Only PNG/JPEG — imgbb rejects SVG.
export const uploadToImgbb = async (
  dataUrl: string,
  name?: string,
): Promise<UploadResult> => {
  const ownKey = getImgbbKey()
  const image = toBase64(dataUrl)

  if (ownKey) {
    const form = new FormData()
    form.append("image", image)
    if (name) form.append("name", name)

    const res = await fetch(`${IMGBB_ENDPOINT}?key=${ownKey}`, {
      method: "POST",
      body: form,
    })
    const json = (await res.json().catch(() => null)) as
      | { data?: { url?: string; delete_url?: string }; success?: boolean }
      | null
    if (!res.ok || !json?.success || !json.data?.url) {
      throw new Error(`Upload failed (${res.status})`)
    }
    const result: UploadResult = {
      url: json.data.url,
      deleteUrl: json.data.delete_url ?? null,
    }
    recordUpload({ ...result, time: new Date().toISOString() }, false)
    return result
  }

  // Free tier — enforce soft limit before hitting the proxy.
  if (getFreeUploadCount() >= FREE_LIMIT) {
    throw new FreeLimitReachedError()
  }

  const res = await fetch("/api/imgbb/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, name }),
  })
  const json = (await res.json().catch(() => null)) as
    | { url?: string; deleteUrl?: string | null; error?: string }
    | null
  if (!res.ok || !json?.url) {
    throw new Error(json?.error ?? `Upload failed (${res.status})`)
  }
  const result: UploadResult = { url: json.url, deleteUrl: json.deleteUrl ?? null }
  recordUpload({ ...result, time: new Date().toISOString() }, true)
  return result
}
