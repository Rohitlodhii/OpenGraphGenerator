import { getSupabaseClient } from "@/lib/supabase"
import {
  StorageServiceError,
  type DeleteOptions,
  type PublicUrlOptions,
  type UploadOptions,
  type UploadResult,
} from "@/types/storage"
import { generateFileName } from "@/utils/generate-file-name"

const normalizeBucket = (bucket: string) => {
  const normalized = bucket.trim()
  if (!normalized || normalized.includes("/")) {
    throw new StorageServiceError(
      "A valid Supabase Storage bucket is required.",
      "configuration",
    )
  }
  return normalized
}

const normalizeFolder = (folder?: string) => {
  if (!folder) return ""

  const segments = folder
    .split("/")
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (segments.some((segment) => segment === "." || segment === "..")) {
    throw new StorageServiceError(
      "Storage folders cannot contain relative path segments.",
      "upload",
    )
  }

  return segments.join("/")
}

const normalizePath = (
  path: string,
  operation: "delete" | "public-url",
) => {
  const normalized = path.replace(/^\/+/, "").trim()
  if (
    !normalized ||
    normalized.split("/").some((segment) => segment === "." || segment === "..")
  ) {
    throw new StorageServiceError(
      "A valid storage object path is required.",
      operation,
    )
  }
  return normalized
}

export class StorageService {
  /**
   * Uploads a file with a unique UUID-and-timestamp filename and returns its
   * Supabase metadata and public URL.
   *
   * @example
   * const result = await storageService.upload({
   *   bucket: "uploads",
   *   folder: "avatars",
   *   file,
  * })
   */
  async upload(options: UploadOptions): Promise<UploadResult> {
    try {
      const bucket = normalizeBucket(options.bucket)
      const folder = normalizeFolder(options.folder)
      const fileName = generateFileName(options.file.name)
      const path = folder ? `${folder}/${fileName}` : fileName
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, options.file, {
          cacheControl: options.cacheControl ?? "3600",
          contentType: options.file.type || "application/octet-stream",
          upsert: false,
        })

      if (error) {
        throw new StorageServiceError(
          "Supabase Storage could not upload the file.",
          "upload",
          { cause: error },
        )
      }

      return {
        bucket,
        path: data.path,
        fileName,
        publicUrl: this.getPublicUrl({ bucket, path: data.path }),
      }
    } catch (error) {
      if (error instanceof StorageServiceError) throw error
      throw new StorageServiceError(
        "An unexpected error occurred while uploading the file.",
        "upload",
        { cause: error },
      )
    }
  }

  /**
   * Deletes one uploaded object from a Supabase Storage bucket.
   */
  async delete(options: DeleteOptions): Promise<void> {
    try {
      const bucket = normalizeBucket(options.bucket)
      const path = normalizePath(options.path, "delete")
      const { error } = await getSupabaseClient().storage
        .from(bucket)
        .remove([path])

      if (error) {
        throw new StorageServiceError(
          "Supabase Storage could not delete the file.",
          "delete",
          { cause: error },
        )
      }
    } catch (error) {
      if (error instanceof StorageServiceError) throw error
      throw new StorageServiceError(
        "An unexpected error occurred while deleting the file.",
        "delete",
        { cause: error },
      )
    }
  }

  /**
   * Returns the SDK-generated public URL for an object in a public bucket.
   */
  getPublicUrl(options: PublicUrlOptions): string {
    try {
      const bucket = normalizeBucket(options.bucket)
      const path = normalizePath(options.path, "public-url")
      const { data } = getSupabaseClient().storage
        .from(bucket)
        .getPublicUrl(path)

      if (!data.publicUrl) {
        throw new StorageServiceError(
          "Supabase Storage did not return a public URL.",
          "public-url",
        )
      }

      return data.publicUrl
    } catch (error) {
      if (error instanceof StorageServiceError) throw error
      throw new StorageServiceError(
        "An unexpected error occurred while generating the public URL.",
        "public-url",
        { cause: error },
      )
    }
  }
}

export const storageService = new StorageService()
