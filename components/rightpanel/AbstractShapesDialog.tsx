"use client"

import React from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogPortal, DialogBackdrop } from "@/components/ui/dialog"
import { Sheet, SheetPopup } from "@/components/ui/sheet"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { useGridKeyboardNav } from "@/hooks/use-grid-keyboard-nav"
import { abstractShapes, AbstractShapeDef } from "@/data/abstract-shapes"
import { importSVG, ImportResult } from "@/lib/svg-import"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUse: (shape: AbstractShapeDef, result: ImportResult) => void
}

const AbstractShapesDialog: React.FC<Props> = ({ open, onOpenChange, onUse }) => {
  const isMobile = useIsMobile()
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const gridRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open) {
      setSelectedId(null)
      setError(null)
    }
  }, [open])

  const handleUse = React.useCallback(async () => {
    const shape = abstractShapes.find((s) => s.id === selectedId)
    if (!shape || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(shape.src)
      if (!res.ok) throw new Error(`Failed to load ${shape.name}`)
      const text = await res.text()
      const result = importSVG(text)
      if (!result.success || !result.root) {
        throw new Error(result.error ?? "Could not parse shape")
      }
      onUse(shape, result)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed")
    } finally {
      setLoading(false)
    }
  }, [selectedId, loading, onUse, onOpenChange])

  const onKeyDown = useGridKeyboardNav({
    enabled: open,
    ids: abstractShapes.map((s) => s.id),
    selectedId,
    setSelectedId,
    onEnter: () => {
      void handleUse()
    },
    containerRef: gridRef,
  })

  const header = (
    <div className="flex flex-col gap-1 border-b border-border bg-sidebar px-6 py-4">
      <h2 className="font-heading font-semibold text-xl leading-none">Abstract Shapes</h2>
      <p className="text-muted-foreground text-sm">
        Pick a shape and drop it on your canvas. Each part stays recolorable and editable.
      </p>
    </div>
  )

  const body = (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full">
        {abstractShapes.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
            No shapes yet.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-3 gap-2 p-6 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10"
          >
            {abstractShapes.map((s) => {
              const isSelected = s.id === selectedId
              return (
                <button
                  key={s.id}
                  type="button"
                  data-grid-item
                  onClick={() => setSelectedId(s.id)}
                  title={s.name}
                  aria-pressed={isSelected}
                  className={cn(
                    "group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-muted/40 p-1.5 transition",
                    isSelected
                      ? "border-primary ring-2 ring-primary"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.name}
                    draggable={false}
                    className="h-full w-full object-contain"
                  />
                  {isSelected && (
                    <span className="absolute end-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )

  const footer = (
    <div className="flex items-center justify-between gap-4 border-t border-border bg-sidebar px-6 py-3">
      <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
        {error ? (
          <span className="text-destructive">{error}</span>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <Kbd>Esc</Kbd> Close
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>Enter</Kbd> Select
            </span>
            <span className="flex items-center gap-1.5">
              <KbdGroup>
                <Kbd>&larr;</Kbd>
                <Kbd>&rarr;</Kbd>
                <Kbd>&uarr;</Kbd>
                <Kbd>&darr;</Kbd>
              </KbdGroup>
              Move
            </span>
          </>
        )}
      </div>
      <Button size="sm" onClick={() => void handleUse()} disabled={!selectedId || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Use this"}
      </Button>
    </div>
  )

  const content = (
    <div
      className="flex h-full min-h-0 flex-col outline-none"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      {header}
      {body}
      {footer}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetPopup side="bottom" className="h-[85vh] p-0">
          {content}
        </SheetPopup>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center p-4">
          <DialogPrimitive.Popup className="relative flex h-[80vh] max-h-full w-full max-w-7xl flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg transition-[scale,opacity] duration-200 data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0">
            {content}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPortal>
    </Dialog>
  )
}

export default AbstractShapesDialog
