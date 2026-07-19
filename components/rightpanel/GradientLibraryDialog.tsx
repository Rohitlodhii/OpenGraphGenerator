"use client"

import React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs"
import { Dialog, DialogPortal, DialogBackdrop } from "@/components/ui/dialog"
import { Sheet, SheetPopup } from "@/components/ui/sheet"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { useGridKeyboardNav } from "@/hooks/use-grid-keyboard-nav"
import { useGradientStore } from "@/store/gradientstore"
import { useBackgroundStore } from "@/store/backgroundstore"
import { gradientCategories, libraryGradients } from "@/data/gradients"
import RawGradientSvg from "@/components/previewers/RawGradientSvg"

const ALL = "all"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const GradientLibraryDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const isMobile = useIsMobile()
  const appliedGradientId = useGradientStore((s) => s.appliedGradientId)
  const setAppliedGradient = useGradientStore((s) => s.setAppliedGradient)
  const setBackgroundType = useBackgroundStore((s) => s.setBackgroundType)

  const [tab, setTab] = React.useState<string>(ALL)
  const [selectedId, setSelectedId] = React.useState<string | null>(
    appliedGradientId,
  )
  const gridRef = React.useRef<HTMLDivElement>(null)

  // Sync local selection with the applied gradient whenever the panel opens.
  React.useEffect(() => {
    if (open) {
      setSelectedId(appliedGradientId)
    }
  }, [open, appliedGradientId])

  const visible = React.useMemo(
    () =>
      tab === ALL
        ? libraryGradients
        : libraryGradients.filter((g) => g.categoryId === tab),
    [tab],
  )

  const handleUse = React.useCallback(() => {
    if (!selectedId) return
    setAppliedGradient(selectedId)
    setBackgroundType("gradient")
    onOpenChange(false)
  }, [selectedId, setAppliedGradient, setBackgroundType, onOpenChange])

  const onKeyDown = useGridKeyboardNav({
    enabled: open,
    ids: visible.map((g) => g.id),
    selectedId,
    setSelectedId,
    onEnter: handleUse,
    containerRef: gridRef,
  })

  const header = (
    <div className="flex flex-col gap-3 border-b border-border bg-sidebar px-6 py-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading font-semibold text-xl leading-none">
          Gradients
        </h2>
        <p className="text-muted-foreground text-sm">
          Pick a gradient background and apply it to your canvas.
        </p>
      </div>
      <Tabs value={tab} onValueChange={(v) => setTab(v as string)}>
        <TabsList>
          <TabsTab value={ALL}>All</TabsTab>
          {gradientCategories.map((c) => (
            <TabsTab key={c.id} value={c.id}>
              {c.label}
            </TabsTab>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )

  const body = (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full">
        {visible.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
            No gradients in this category yet.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-3 gap-2 p-6 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8"
          >
            {visible.map((g) => {
              const isSelected = g.id === selectedId
              return (
                <button
                  key={g.id}
                  type="button"
                  data-grid-item
                  onClick={() => setSelectedId(g.id)}
                  className={cn(
                    "group relative aspect-video overflow-hidden rounded-lg border bg-muted/40 text-left transition ring-offset-2 ring-offset-background",
                    isSelected
                      ? "border-primary ring-2 ring-primary"
                      : "border-border hover:border-primary/50",
                  )}
                  title={g.name}
                  aria-pressed={isSelected}
                >
                  <RawGradientSvg svg={g.svg} />
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
      </div>
      <Button size="sm" onClick={handleUse} disabled={!selectedId}>
        Use this
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

export default GradientLibraryDialog
