"use client"

import React, { useState } from "react"
import { ImageIcon, Loader2, Search, Sparkles } from "lucide-react"
import { Button } from "../ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useCanvasStore } from "@/store/canvasstore"
import AsciiGeneratorDialog, { AsciiConfig } from "./AsciiGeneratorDialog"

type ToolSource = "illustration" | "unsplash"

type ToolAsset = {
  id: string
  name: string
  type: string
  thumbnail: string | null
  preview: string | null
  packId: string | null
  svgAvailable: boolean
  hasAccess: boolean
}

const SOURCES: { value: ToolSource; label: string }[] = [
  { value: "illustration", label: "Illustration API" },
  { value: "unsplash", label: "Unsplash Images" },
]

const SEARCH_ENDPOINT: Record<ToolSource, string> = {
  illustration: "/api/illustrations/search",
  unsplash: "/api/unsplash/search",
}

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `tool-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const ToolsPanel = () => {
  const { objects, addObject } = useCanvasStore()
  const [source, setSource] = useState<ToolSource>("illustration")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ToolAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [searched, setSearched] = useState(false)
  const [asciiOpen, setAsciiOpen] = useState(false)

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setLimitReached(false)
    setSearched(true)
    try {
      const res = await fetch(
        `${SEARCH_ENDPOINT[source]}?q=${encodeURIComponent(trimmed)}`,
      )
      const data = await res.json()
      if (!res.ok) {
        if (data?.code === "LIMIT_REACHED") setLimitReached(true)
        throw new Error(data?.error ?? "Search failed")
      }
      setResults(data.illustrations ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSourceChange = (value: ToolSource) => {
    setSource(value)
    // Reset the result state so the two sources don't bleed into each other.
    setResults([])
    setError(null)
    setLimitReached(false)
    setSearched(false)
  }

  const handleAdd = async (asset: ToolAsset) => {
    if (addingId) return
    setAddingId(asset.id)
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)

    try {
      // Try inline SVG only when the asset is unlocked for this key; otherwise
      // the endpoint is gated and we go straight to the preview raster.
      let svg: string | null = null
      if (asset.svgAvailable && asset.hasAccess) {
        const res = await fetch(
          `/api/illustrations/svg?type=${encodeURIComponent(asset.type)}&id=${encodeURIComponent(asset.id)}`,
        )
        const data = await res.json().catch(() => null)
        svg = data?.svg ?? null
      }

      if (svg && svg.trim().startsWith("<svg")) {
        addObject({
          id: createId(),
          type: "svg",
          content: svg,
          x: 80,
          y: 80,
          width: 280,
          height: 280,
          zIndex: maxZIndex + 1,
        })
      } else {
        // Fall back to the preview/thumbnail raster image.
        const src = asset.preview ?? asset.thumbnail
        if (!src) throw new Error("No usable asset returned")
        addObject({
          id: createId(),
          type: "image",
          src,
          x: 80,
          y: 80,
          width: 280,
          height: 280,
          zIndex: maxZIndex + 1,
          imageCropX: 0,
          imageCropY: 0,
          imageCropScale: 1,
          imageBorderRadius: 8,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add asset")
    } finally {
      setAddingId(null)
    }
  }

  const placeholder =
    source === "unsplash" ? "Search Unsplash images..." : "Search illustrations..."

  const handleAddAscii = (config: AsciiConfig) => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    addObject({
      id: createId(),
      type: "ascii",
      src: config.src,
      x: 80,
      y: 80,
      width: 320,
      height: 320,
      zIndex: maxZIndex + 1,
      asciiResolution: config.resolution,
      asciiCharset: config.charset,
      asciiColor: config.color,
      asciiBackgroundColor: config.backgroundColor,
      asciiInverted: config.inverted,
      asciiColored: config.colored,
      asciiAnimationStyle: config.animationStyle,
      asciiObjectFit: config.objectFit,
    })
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Tools</span>
        <button
          type="button"
          onClick={() => setAsciiOpen(true)}
          className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-left transition hover:border-primary hover:bg-accent/50"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-medium">ASCII Generator</span>
            <span className="text-[11px] text-muted-foreground">
              Turn an image into ASCII art
            </span>
          </span>
        </button>
      </div>

      <AsciiGeneratorDialog
        open={asciiOpen}
        onOpenChange={setAsciiOpen}
        onUse={handleAddAscii}
      />

      <div className="my-1 h-px w-full bg-border" />
      <span className="text-xs font-medium text-muted-foreground">Asset Search</span>

      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="flex h-8 flex-1 items-center gap-2 rounded-md border border-border px-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none ring-0"
          />
        </div>
        <Button type="submit" size="sm" className="h-8 rounded-md px-3 text-xs" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      <Select
        value={source}
        onValueChange={(value) => handleSourceChange(value as ToolSource)}
      >
        <SelectTrigger className="h-8 text-xs" size="default">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SOURCES.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
          {limitReached && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Open Profile → Connectors to add your own{" "}
              {source === "unsplash" ? "Unsplash" : "Illustration"} API key for
              unlimited searches.
            </p>
          )}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching...
        </div>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <div className="flex flex-col items-center gap-2 py-8 text-xs text-muted-foreground">
          <ImageIcon className="h-6 w-6" />
          No results found. Try another search.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {results.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => handleAdd(asset)}
              disabled={addingId !== null}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40 p-2 transition hover:border-primary disabled:opacity-60"
              title={asset.name}
            >
              {asset.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.thumbnail}
                  alt={asset.name}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
              {addingId === asset.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ToolsPanel
