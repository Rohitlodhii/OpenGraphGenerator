"use client"

import React, { useState } from "react"
import { ImageIcon, Loader2, Search } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useCanvasStore } from "@/store/canvasstore"

type Illustration = {
  id: string
  name: string
  type: string
  thumbnail: string | null
  preview: string | null
  packId: string | null
  svgAvailable: boolean
  hasAccess: boolean
}

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `illustration-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const IllustrationsPanel = () => {
  const { objects, addObject } = useCanvasStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Illustration[]>([])
  const [loading, setLoading] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setSearched(true)
    try {
      const res = await fetch(`/api/illustrations/search?q=${encodeURIComponent(trimmed)}`)
      const data = await res.json()
      if (!res.ok) {
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

  const handleAdd = async (illustration: Illustration) => {
    if (addingId) return
    setAddingId(illustration.id)
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)

    try {
      // Try inline SVG only when the asset is unlocked for this key; otherwise
      // the endpoint is gated and we go straight to the preview raster.
      let svg: string | null = null
      if (illustration.svgAvailable && illustration.hasAccess) {
        const res = await fetch(
          `/api/illustrations/svg?type=${encodeURIComponent(illustration.type)}&id=${encodeURIComponent(illustration.id)}`,
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
        const src = illustration.preview ?? illustration.thumbnail
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
      setError(err instanceof Error ? err.message : "Failed to add illustration")
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="flex h-8 flex-1 items-center gap-2 rounded-md border border-border px-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search illustrations..."
            className="h-full w-full min-w-0 border-0 bg-transparent text-xs outline-none ring-0"
          />
        </div>
        <Button type="submit" size="sm" className="h-8 rounded-md px-3 text-xs" disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
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
          No illustrations found. Try another search.
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {results.map((illustration) => (
            <button
              key={illustration.id}
              type="button"
              onClick={() => handleAdd(illustration)}
              disabled={addingId !== null}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border bg-muted/40 p-2 transition hover:border-primary disabled:opacity-60"
              title={illustration.name}
            >
              {illustration.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={illustration.thumbnail}
                  alt={illustration.name}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
              {addingId === illustration.id && (
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

export default IllustrationsPanel
