const SAFE_EXTENSION = /^[a-z0-9]{1,12}$/

const getOriginalExtension = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  return extension && SAFE_EXTENSION.test(extension) ? extension : ""
}

/**
 * Generates a collision-resistant storage filename while preserving the
 * original file extension when it is safe to use.
 */
export const generateFileName = (originalFileName: string) => {
  const uuid = crypto.randomUUID()
  const timestamp = Date.now()
  const extension = getOriginalExtension(originalFileName)
  return `${uuid}_${timestamp}${extension ? `.${extension}` : ""}`
}
