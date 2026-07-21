export interface StorageFile extends Blob {
  readonly name: string
}

export interface UploadOptions {
  bucket: string
  folder?: string
  file: StorageFile
  cacheControl?: string
}

export interface UploadResult {
  bucket: string
  path: string
  fileName: string
  publicUrl: string
}

export interface DeleteOptions {
  bucket: string
  path: string
}

export interface PublicUrlOptions {
  bucket: string
  path: string
}

export type StorageOperation = "configuration" | "upload" | "delete" | "public-url"

export class StorageServiceError extends Error {
  readonly operation: StorageOperation

  constructor(
    message: string,
    operation: StorageOperation,
    options?: ErrorOptions,
  ) {
    super(message, options)
    this.name = "StorageServiceError"
    this.operation = operation
  }
}
