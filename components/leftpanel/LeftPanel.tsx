"use client"

import React, { useState } from "react"
import {
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
import TextAddingPanel from "../rightpanel/TextAddingPanel"
import ImageAddingPanel from "../rightpanel/ImageAddingPanel"

type LeftTab = "templates" | "size" | "background" | "shapes" | "text" | "images"

const tabs: { id: LeftTab; label: string; icon: React.ElementType }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "size", label: "Size", icon: Proportions },
  { id: "background", label: "Background", icon: Palette },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
]

const tabTitles: Record<LeftTab, string> = {
  templates: "Templates",
  size: "Size",
  background: "Background",
  shapes: "Shapes",
  text: "Text",
  images: "Images",
}

const LeftPanel = () => {
  const [activeTab, setActiveTab] = useState<LeftTab>("templates")

  return (
    <div className="flex h-full w-full">
      {/* Icon rail (left edge) */}
      <div className="w-14 shrink-0 h-full border-r border-border bg-sidebar flex flex-col py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`flex flex-col items-center gap-1 py-3 mx-1 rounded-lg transition-colors ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Options sidebar */}
      <div className="hide-scrollbar flex-1 min-w-0 h-full overflow-y-auto flex flex-col gap-3 p-3">
        <div className="text-sm font-semibold text-foreground">
          {tabTitles[activeTab]}
        </div>

        {activeTab === "templates" && <TemplateList />}
        {activeTab === "size" && <DimensionControls />}
        {activeTab === "background" && <BackgroundPanel chromeless />}
        {activeTab === "shapes" && <ShapesPanel chromeless />}
        {activeTab === "text" && <TextAddingPanel chromeless />}
        {activeTab === "images" && <ImageAddingPanel chromeless />}
      </div>
    </div>
  )
}

export default LeftPanel
