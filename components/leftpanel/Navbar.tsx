"use client"

import React from "react"
import { Layers } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useLayersPanelStore } from "@/store/layerspanelstore"

type NavbarProps = {
  showSidebarToggle?: boolean
}

const Navbar = ({ showSidebarToggle = false }: NavbarProps) => {
  const toggleLayers = useLayersPanelStore((state) => state.toggle)
  const layersOpen = useLayersPanelStore((state) => state.open)

  return (
    <header className="w-full h-14 shrink-0 px-4 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="h-9 w-9 aspect-square rounded-xl bg-amber-700" />
        <div className="font-mono text-base tracking-wide">OPENGG</div>
      </div>

      <div className="flex items-center gap-2">
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
        {showSidebarToggle ? (
          <SidebarTrigger aria-label="Toggle left sidebar" />
        ) : null}
      </div>
    </header>
  )
}

export default Navbar
