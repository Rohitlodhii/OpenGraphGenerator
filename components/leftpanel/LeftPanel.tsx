"use client"

import React, { useState } from "react"
import { LayoutTemplate, Proportions } from "lucide-react"
import TemplateList from "./TemplateList"
import { DimensionControls } from "../rightpanel/DimensionControls"

type LeftTab = "templates" | "size"

const tabs: { id: LeftTab; label: string; icon: React.ElementType }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "size", label: "Size", icon: Proportions },
]

const tabTitles: Record<LeftTab, string> = {
  templates: "Templates",
  size: "Size",
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
      </div>
    </div>
  )
}

export default LeftPanel
