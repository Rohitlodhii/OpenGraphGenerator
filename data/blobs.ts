// Catalog of decorative "blob" SVGs. Blobs are added to the canvas as editable
// objects (color / blur / grain, placeable anywhere). To add more, paste a new
// object below with its raw SVG export.

export type BlobDef = {
  id: string
  name: string
  // First color used as the default fill when a blob is placed.
  defaultColor: string
  // Raw SVG markup. Ids are namespaced per-instance at render time.
  svg: string
}

export const blobs: BlobDef[] = [
  {
    id: "blob-1",
    name: "Teal Pebble",
    defaultColor: "#50C9C3",
    svg: `<svg width="400" height="378" viewBox="0 0 400 378" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M204.179 1.7969C245.034 2.37377 287.753 0.71215 321.808 23.2587C356.626 46.3102 377.834 84.7475 389.833 124.71C401.626 163.987 405.614 207.525 388.296 244.704C371.866 279.976 332.008 294.493 300.252 317.022C268.936 339.239 242.164 369.615 204.179 375.325C162.809 381.544 120.207 371.249 84.515 349.452C46.7836 326.409 7.11251 294.704 0.623614 251.012C-5.72219 208.283 38.111 176.462 52.7892 135.829C66.7305 97.2354 53.3685 47.1183 84.1092 19.9024C115.158 -7.58672 162.691 1.21108 204.179 1.7969Z" fill="url(#paint0_linear_2_196)"/>
<defs>
<linearGradient id="paint0_linear_2_196" x1="0" y1="188.558" x2="400" y2="188.558" gradientUnits="userSpaceOnUse">
<stop stop-color="#50C9C3"/>
<stop offset="1" stop-color="#96DEDA"/>
</linearGradient>
</defs>
</svg>`,
  },
]

// Aspect ratio (width / height) of a blob's viewBox, for sizing on the canvas.
export const blobAspect = (blob: BlobDef): number => {
  const match = blob.svg.match(/viewBox="([\d.\s-]+)"/)
  if (!match) return 1
  const parts = match[1].trim().split(/\s+/).map(Number)
  const w = parts[2]
  const h = parts[3]
  if (!w || !h) return 1
  return w / h
}
