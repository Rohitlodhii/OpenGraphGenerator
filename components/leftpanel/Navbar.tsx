"use client"

import React from "react"
import { Layers, Undo2, Redo2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLayersPanelStore } from "@/store/layerspanelstore"
import { useHistoryStore } from "@/store/historystore"
import { undo, redo } from "@/hooks/use-history"

const Navbar = () => {
  const toggleLayers = useLayersPanelStore((state) => state.toggle)
  const layersOpen = useLayersPanelStore((state) => state.open)
  const canUndo = useHistoryStore((state) => state.past.length > 0)
  const canRedo = useHistoryStore((state) => state.future.length > 0)

  return (
    <header className="w-full h-14 shrink-0 px-4 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="h-9 w-9 aspect-square rounded-xl bg-amber-700" />
        <div className="font-mono text-base tracking-wide">OPENGG</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant={layersOpen ? "secondary" : "outline"}
          size="sm"
          className="gap-2"
          aria-pressed={layersOpen}
          onClick={toggleLayers}
        >
          <Layers className="h-4 w-4" />
          Layers
        </Button>
      </div>
    </header>
  )
}

export default Navbar
