"use client"

import React, { useEffect, useRef, useState } from "react"
import {
  Grid2x2,
  ImageIcon,
  LayoutTemplate,
  Palette,
  Proportions,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react"
import TemplateList from "./TemplateList"
import { DimensionControls } from "../rightpanel/DimensionControls"
import BackgroundPanel from "../rightpanel/BackgroundPanel"
import ShapesPanel from "../rightpanel/ShapesPanel"
import PatternsPanel from "../rightpanel/PatternsPanel"
import TextAddingPanel from "../rightpanel/TextAddingPanel"
import ImageAddingPanel from "../rightpanel/ImageAddingPanel"
import IllustrationsPanel from "../rightpanel/IllustrationsPanel"
import { useCanvasStore } from "@/store/canvasstore"

type LeftTab = "templates" | "size" | "background" | "patterns" | "shapes" | "text" | "images" | "illustrations"

const tabs: { id: LeftTab; label: string; icon: React.ElementType }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "size", label: "Size", icon: Proportions },
  { id: "background", label: "Background", icon: Palette },
  { id: "patterns", label: "Patterns", icon: Grid2x2 },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "illustrations", label: "Illustrations", icon: Sparkles },
]

const tabTitles: Record<LeftTab, string> = {
  templates: "Templates",
  size: "Size",
  background: "Background",
  patterns: "Patterns",
  shapes: "Shapes",
  text: "Text",
  images: "Images",
  illustrations: "Illustrations",
}

const objectTypeToTab: Record<string, LeftTab> = {
  text: "text",
  image: "images",
  shape: "shapes",
  pattern: "patterns",
}

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState<LeftTab>("templates")
  const objects = useCanvasStore((s) => s.objects)
  const selectedObjectId = useCanvasStore((s) => s.selectedObjectId)
  const prevSelectedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!selectedObjectId || selectedObjectId === prevSelectedRef.current) {
      prevSelectedRef.current = selectedObjectId
      return
    }
    prevSelectedRef.current = selectedObjectId
    const selected = objects.find((object) => object.id === selectedObjectId)
    if (!selected) return
    const tab = objectTypeToTab[selected.type]
    if (tab) setActiveTab(tab)
  }, [selectedObjectId, objects])

  return (
    <div className="flex h-full w-full">
      {/* Icon rail (left edge) */}
      <div className="w-16 shrink-0 h-full border-r border-border bg-sidebar flex flex-col py-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-1 py-2.5 mx-1.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-none font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Options sidebar */}
      <div className="hide-scrollbar flex-1 min-w-0 h-full overflow-y-auto flex flex-col gap-4 p-4">
        <div className="text-base font-semibold text-foreground">
          {tabTitles[activeTab]}
        </div>

        {activeTab === "templates" && <TemplateList />}
        {activeTab === "size" && <DimensionControls />}
        {activeTab === "background" && <BackgroundPanel chromeless />}
        {activeTab === "patterns" && <PatternsPanel chromeless />}
        {activeTab === "shapes" && <ShapesPanel chromeless />}
        {activeTab === "text" && <TextAddingPanel chromeless />}
        {activeTab === "images" && <ImageAddingPanel chromeless />}
        {activeTab === "illustrations" && <IllustrationsPanel />}
      </div>
    </div>
  )
}

export default LeftPanel
