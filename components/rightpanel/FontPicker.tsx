"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"
import { Popover, PopoverPopup, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { type GoogleFont, toFontFamilyValue } from "@/lib/fonts"
import { loadFont, subscribeFontState, getFontState } from "@/lib/font-loader"
import {
  useDebouncedValue,
  useGoogleFonts,
} from "@/hooks/use-google-fonts"

// How many fonts to show before the user searches / scrolls. Keeps the initial
// render (and initial lazy-load work) small.
const INITIAL_VISIBLE = 40
// How many more to reveal each time the sentinel scrolls into view.
const PAGE = 30

type FontPickerProps = {
  // Current stored fontFamily CSS value, e.g. "'Poppins', sans-serif".
  value?: string
  // Currently selected raw family name, e.g. "Poppins".
  selectedFamily?: string | null
  onSelect: (fontFamilyValue: string, font: GoogleFont) => void
  className?: string
}

// A single row. Lazy-loads its own font face the first time it scrolls into
// view so the name renders in its actual typeface without loading everything.
const FontRow = ({
  font,
  active,
  onSelect,
}: {
  font: GoogleFont
  active: boolean
  onSelect: () => void
}) => {
  const rowRef = React.useRef<HTMLButtonElement>(null)
  const [inView, setInView] = React.useState(false)

  // Re-render when this font's load state flips to "loaded".
  const state = React.useSyncExternalStore(
    subscribeFontState,
    () => getFontState(font.family),
    () => undefined,
  )

  React.useEffect(() => {
    const el = rowRef.current
    if (!el || inView) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: "120px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [inView])

  // Kick off the lazy load once the row is visible (cached after first time).
  React.useEffect(() => {
    if (inView) loadFont(font)
  }, [inView, font])

  const loaded = state === "loaded"

  return (
    <button
      ref={rowRef}
      type="button"
      role="option"
      aria-selected={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors",
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
      )}
    >
      <span
        className="truncate"
        style={loaded ? { fontFamily: toFontFamilyValue(font) } : undefined}
      >
        {font.family}
      </span>
      {active && <Check className="h-4 w-4 shrink-0" />}
    </button>
  )
}

const FontPicker = ({
  value,
  selectedFamily,
  onSelect,
  className,
}: FontPickerProps) => {
  const { fonts, loading } = useGoogleFonts()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebouncedValue(query, 150)
  const [visible, setVisible] = React.useState(INITIAL_VISIBLE)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return fonts
    return fonts.filter((font) => font.family.toLowerCase().includes(q))
  }, [fonts, debouncedQuery])

  // Reset paging whenever the query changes or the popover reopens.
  React.useEffect(() => {
    setVisible(INITIAL_VISIBLE)
  }, [debouncedQuery, open])

  const shown = React.useMemo(
    () => filtered.slice(0, visible),
    [filtered, visible],
  )

  // Reveal more rows as the sentinel scrolls into view.
  React.useEffect(() => {
    const el = sentinelRef.current
    if (!el || !open) return
    if (visible >= filtered.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible((v) => Math.min(v + PAGE, filtered.length))
        }
      },
      { rootMargin: "200px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [open, visible, filtered.length])

  // Make sure the currently selected font is loaded so the trigger shows it.
  const selected = React.useMemo(
    () => fonts.find((font) => font.family === selectedFamily) ?? null,
    [fonts, selectedFamily],
  )
  React.useEffect(() => {
    if (selected) loadFont(selected)
  }, [selected])

  const handleSelect = (font: GoogleFont) => {
    onSelect(toFontFamilyValue(font), font)
    setOpen(false)
    setQuery("")
  }

  const triggerLabel = selectedFamily ?? "Select font"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring/40",
          className,
        )}
      >
        <span
          className="truncate"
          style={
            value && selected ? { fontFamily: toFontFamilyValue(selected) } : undefined
          }
        >
          {triggerLabel}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-60" />
      </PopoverTrigger>

      <PopoverPopup
        align="start"
        sideOffset={6}
        className="w-(--anchor-width) min-w-56 rounded-xl p-0"
      >
        <div className="flex flex-col p-0">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="h-4 w-4 shrink-0 opacity-60" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search fonts…"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* List */}
          <div className="hide-scrollbar max-h-72 overflow-y-auto p-1">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading fonts…
              </div>
            ) : shown.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No fonts found
              </div>
            ) : (
              <>
                {shown.map((font) => (
                  <FontRow
                    key={font.family}
                    font={font}
                    active={font.family === selectedFamily}
                    onSelect={() => handleSelect(font)}
                  />
                ))}
                {visible < filtered.length && (
                  <div
                    ref={sentinelRef}
                    className="flex items-center justify-center py-3 text-xs text-muted-foreground"
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PopoverPopup>
    </Popover>
  )
}

export default FontPicker
