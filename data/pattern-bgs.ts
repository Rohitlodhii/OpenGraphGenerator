// Catalog of pattern-background SVGs living in /public/patternbgs. Added to the
// canvas as editable objects (parsed via the SVG import pipeline), the same way
// abstract shapes and motifs are. To add more, drop a file in the folder and
// append an entry here.

export type PatternBgDef = {
  id: string
  name: string
  // Public URL of the pattern SVG.
  src: string
}

export const patternBgs: PatternBgDef[] = Array.from({ length: 7 }, (_, i) => {
  const n = i + 1
  return {
    id: `pattern-${n}`,
    name: `Pattern ${n}`,
    src: `/patternbgs/pattern${n}.svg`,
  }
})
