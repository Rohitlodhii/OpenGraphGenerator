"use client"

import React, { useState } from "react"
import {
  Grid2x2,
  ImageIcon,
  LayoutTemplate,
  Palette,
  Proportions,
  Shapes,
  Type,
} from "lucide-react"
import TemplateList from "./TemplateList"
import { DimensionControls } from "../rightpanel/DimensionControls"
import BackgroundPanel from "../rightpanel/BackgroundPanel"
import ShapesPanel from "../rightpanel/ShapesPanel"
import PatternsPanel from "../rightpanel/PatternsPanel"
import TextAddingPanel from "../rightpanel/TextAddingPanel"
import ImageAddingPanel from "../rightpanel/ImageAddingPanel"

type LeftTab = "templates" | "size" | "background" | "patterns" | "shapes" | "text" | "images"

const tabs: { id: LeftTab; label: string; icon: React.ElementType }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "size", label: "Size", icon: Proportions },
  { id: "background", label: "Background", icon: Palette },
  { id: "patterns", label: "Patterns", icon: Grid2x2 },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
]

const tabTitles: Record<LeftTab, string> = {
  templates: "Templates",
  size: "Size",
  background: "Background",
  patterns: "Patterns",
  shapes: "Shapes",
  text: "Text",
  images: "Images",
}

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState<LeftTab>("templates")

  return (
    <div className="flex h-full w-full">
      {/* Icon rail (left edge) */}
      <div className="w-20 shrink-0 h-full border-r border-border bg-sidebar flex flex-col py-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-1.5 py-3.5 mx-2 rounded-xl transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[11px] leading-none font-medium">{tab.label}</span>
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
      </div>
    </div>
  )
}

export default LeftPanel
