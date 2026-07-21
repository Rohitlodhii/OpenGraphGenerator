"use client"

import React, { useMemo, useState } from "react"
import { Dialog, DialogPopup, DialogHeader, DialogTitle, DialogDescription, DialogPanel, DialogFooter, DialogClose } from "../ui/dialog"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useCanvasStore } from "@/store/canvasstore"
import { textureAssets, TextureCategory, TextureAsset } from "@/store/texturestore"

type PaperTapesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `image-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const CATEGORIES: { id: TextureCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "paper", label: "Paper" },
  { id: "tape", label: "Tapes" },
  { id: "misc", label: "Misc" },
]

// A single texture tile. Keeps its own loaded flag so the skeleton stays until
// the remote image finishes decoding.
const TextureTile = ({ asset, onSelect }: { asset: TextureAsset; onSelect: () => void }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <button
      onClick={onSelect}
      className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-2 text-left transition hover:border-primary hover:bg-muted/40"
      title={asset.name}
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#00000008_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
        {!loaded && <Skeleton className="absolute inset-0 rounded-lg" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.url}
          alt={asset.name}
          onLoad={() => setLoaded(true)}
          className={`h-full w-full object-contain transition group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
        />
      </div>
      <span className="truncate text-[11px] text-muted-foreground">{asset.name}</span>
    </button>
  )
}

const PaperTapesDialog = ({ open, onOpenChange }: PaperTapesDialogProps) => {
  const { objects, addObject, setSelectedObjectId } = useCanvasStore()
  const [filter, setFilter] = useState<TextureCategory | "all">("all")

  const items = useMemo(
    () => (filter === "all" ? textureAssets : textureAssets.filter((a) => a.category === filter)),
    [filter],
  )

  // Drop a texture onto the canvas as a regular, fully-editable image object so
  // every image tool (crop, blur, grain, blend, stroke, radius) applies to it.
  const addTexture = (url: string) => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const id = createId()
    addObject({
      id,
      type: "image",
      src: url,
      x: 100,
      y: 100,
      width: 260,
      height: 180,
      zIndex: maxZIndex + 1,
      imageCropX: 0,
      imageCropY: 0,
      imageCropScale: 1,
      imageBlendMode: "normal",
      imageGrain: 0,
      imageBlur: 0,
      imageBorderRadius: 8,
    })
    setSelectedObjectId(id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-7xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Paper & Tapes</DialogTitle>
          <DialogDescription>
            Click a texture to add it to the canvas as an editable image.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <DialogPanel className="flex flex-col gap-4">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`h-8 rounded-md px-3 text-xs transition ${
                  filter === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="hide-scrollbar grid max-h-[60vh] grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-5 lg:grid-cols-6">
            {items.map((asset) => (
              <TextureTile key={asset.id} asset={asset} onSelect={() => addTexture(asset.url)} />
            ))}
          </div>
        </DialogPanel>

        {/* Footer */}
        <DialogFooter>
          <span className="mr-auto self-center text-xs text-muted-foreground">
            {items.length} texture{items.length === 1 ? "" : "s"}
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

export default PaperTapesDialog
