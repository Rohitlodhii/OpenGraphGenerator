// Helpers for embedding raw Figma-exported SVG strings safely and responsively.

// Namespace every id / url(#id) / href="#id" reference in an SVG string with a
// unique prefix so multiple copies of the same export can render on one page
// without their `filterN_f_8_124` / `clip0_8_124` ids colliding.
export function namespaceSvgIds(svg: string, prefix: string): string {
  const ids = new Set<string>()
  const idAttr = /\bid="([^"]+)"/g
  let match: RegExpExecArray | null
  while ((match = idAttr.exec(svg)) !== null) {
    ids.add(match[1])
  }

  let out = svg
  for (const id of ids) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const next = `${prefix}-${id}`
    // id="X"  ->  id="prefix-X"
    out = out.replace(new RegExp(`\\bid="${escaped}"`, "g"), `id="${next}"`)
    // url(#X) -> url(#prefix-X)   (fill, filter, clip-path, mask, etc.)
    out = out.replace(new RegExp(`url\\(#${escaped}\\)`, "g"), `url(#${next})`)
    // href="#X" / xlink:href="#X"
    out = out.replace(
      new RegExp(`href="#${escaped}"`, "g"),
      `href="#${next}"`,
    )
  }
  return out
}

// Make an SVG fill its container: drop fixed root width/height, add a slicing
// preserveAspectRatio, and stretch to 100% via a style attribute. The viewBox
// is left intact so the artwork keeps its proportions.
export function makeSvgResponsive(svg: string): string {
  let out = svg.replace(
    /<svg\b([^>]*)>/,
    (full, attrs: string) => {
      let a = attrs
        .replace(/\swidth="[^"]*"/, "")
        .replace(/\sheight="[^"]*"/, "")
      if (!/preserveAspectRatio=/.test(a)) {
        a += ' preserveAspectRatio="xMidYMid slice"'
      }
      a += ' style="display:block;width:100%;height:100%"'
      return `<svg${a}>`
    },
  )
  return out
}

// Prepare a raw SVG string for inline embedding: responsive + id-namespaced.
export function prepareSvg(svg: string, prefix: string): string {
  return namespaceSvgIds(makeSvgResponsive(svg), prefix)
}
