"use client"

import React, { useMemo, useState } from "react"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
  DialogClose,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"

// A generic preset shared by the three CSS-preset stores.
export type CssPreset = {
  id: string
  name: string
  wrapperClassName: string
  innerStyle: Record<string, string>
  defaultColor?: string
}

type CssPresetDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  presets: CssPreset[]
  onUse: (preset: CssPreset) => void
}

// One preset tile. Renders the preset's own wrapper + inner layers live (these
// are pure CSS, not remote images) and holds a short skeleton until mounted so
// the grid fades in instead of popping.
const PresetTile = ({ preset, onSelect }: { preset: CssPreset; onSelect: () => void }) => {
  const [ready, setReady] = useState(false)

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex flex-col gap-1.5 overflow-hidden rounded-xl border border-border bg-card p-2 text-left transition-[border-color,background-color,transform] duration-150 ease-out hover:border-primary/70 hover:bg-muted/40 active:scale-[0.985]"
      title={preset.name}
    >
      <div className="bg-pattern relative aspect-video w-full overflow-hidden rounded-lg border border-border/70 p-1.5 shadow-inner">
        {!ready && <Skeleton className="absolute inset-0" />}
        <div
          className={`relative h-full w-full overflow-hidden rounded-md shadow-sm ring-1 ring-black/5 transition-opacity duration-200 dark:ring-white/10 ${
            ready ? "opacity-100" : "opacity-0"
          } isolate ${preset.wrapperClassName}`}
          style={{
            minHeight: 0,
            minWidth: 0,
            contain: "layout paint",
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out group-hover:scale-[1.025]"
            style={{ minHeight: 0, ...(preset.innerStyle as React.CSSProperties) }}
          />
        </div>
      </div>
      <span className="truncate text-[11px] text-muted-foreground">{preset.name}</span>
    </button>
  )
}

const CssPresetDialog = ({
  open,
  onOpenChange,
  title,
  description,
  presets,
  onUse,
}: CssPresetDialogProps) => {
  const [query, setQuery] = useState("")

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return presets
    return presets.filter((p) => p.name.toLowerCase().includes(q))
  }, [presets, query])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-7xl overflow-hidden">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        <DialogPanel className="flex min-h-0 flex-col gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search presets..."
            className="h-8 w-full max-w-xs rounded-md border border-border bg-muted/40 px-2 text-xs outline-none focus:border-primary"
          />
          <div className="hide-scrollbar grid min-h-0 max-h-[62vh] grid-cols-2 gap-3 overflow-y-auto pr-0.5 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((preset) => (
              <PresetTile
                key={preset.id}
                preset={preset}
                onSelect={() => {
                  onUse(preset)
                  onOpenChange(false)
                }}
              />
            ))}
          </div>
        </DialogPanel>

        {/* Footer */}
        <DialogFooter>
          <span className="mr-auto self-center text-xs text-muted-foreground">
            {items.length} preset{items.length === 1 ? "" : "s"}
          </span>
          <DialogClose
            render={
              <Button variant="secondary" size="sm">
                Close
              </Button>
            }
          />
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export default CssPresetDialog
