"use client"

import type { CanvasObject } from "@/store/canvasstore"

const DATABASE_NAME = "opengg-local-assets"
const DATABASE_VERSION = 1
const IMAGE_STORE = "images"
export const LOCAL_IMAGE_SCHEME = "local-image://"

type LocalImageRecord = {
  id: string
  blob: Blob
  name: string
  size: number
  type: string
  createdAt: string
}

export type ImportedLocalImage = {
  src: string
  assetId?: string
  fileName: string
  fileSize: number
  mimeType: string
}

const createAssetId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `asset-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
}

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(IMAGE_STORE)) {
        database.createObjectStore(IMAGE_STORE, { keyPath: "id" })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const putImageRecord = async (record: LocalImageRecord) => {
  const database = await openDatabase()
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE, "readwrite")
    transaction.objectStore(IMAGE_STORE).put(record)
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
  database.close()
}

export const getLocalImageBlob = async (assetId: string) => {
  if (typeof indexedDB === "undefined") return null
  const database = await openDatabase()
  const record = await new Promise<LocalImageRecord | undefined>((resolve, reject) => {
    const transaction = database.transaction(IMAGE_STORE, "readonly")
    const request = transaction.objectStore(IMAGE_STORE).get(assetId)
    request.onsuccess = () => resolve(request.result as LocalImageRecord | undefined)
    request.onerror = () => reject(request.error)
  })
  database.close()
  return record?.blob ?? null
}

export const importImageFileLocally = async (
  file: File,
): Promise<ImportedLocalImage> => {
  const src = URL.createObjectURL(file)
  const assetId = createAssetId()

  try {
    await putImageRecord({
      id: assetId,
      blob: file,
      name: file.name,
      size: file.size,
      type: file.type,
      createdAt: new Date().toISOString(),
    })
    return {
      src,
      assetId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    }
  } catch {
    return {
      src,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    }
  }
}

export const localImageMarker = (assetId: string) =>
  `${LOCAL_IMAGE_SCHEME}${assetId}`

export const hydrateLocalCanvasImages = async (
  objects: CanvasObject[],
): Promise<Map<string, string>> => {
  const hydrated = new Map<string, string>()

  await Promise.all(
    objects.map(async (object) => {
      if (
        object.type !== "image" ||
        !object.imageAssetId ||
        !object.src?.startsWith(LOCAL_IMAGE_SCHEME)
      ) {
        return
      }
      const blob = await getLocalImageBlob(object.imageAssetId)
      if (blob) hydrated.set(object.id, URL.createObjectURL(blob))
    }),
  )

  return hydrated
}
