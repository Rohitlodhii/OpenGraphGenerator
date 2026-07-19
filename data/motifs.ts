// Catalog of decorative "motif" SVGs living in /public/motifs. Motifs are added
// to the canvas as non-editable objects — only blur and grain are adjustable.

export type MotifDef = {
  id: string
  name: string
  // Public URL of the motif SVG.
  src: string
}

export const motifs: MotifDef[] = Array.from({ length: 25 }, (_, i) => {
  const n = i + 1
  return {
    id: `motif-${n}`,
    name: `Motif ${n}`,
    src: `/motifs/motif-${n}.svg`,
  }
})
