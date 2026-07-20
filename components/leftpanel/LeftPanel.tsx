"use client"

import React, { useEffect, useRef, useState } from "react"
import { LeftTab, tabs, tabTitles, objectTypeToTab, PanelContent } from "./panelConfig"
import { useCanvasStore } from "@/store/canvasstore"

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
      <div className="w-16 shrink-0 h-full border-r border-sidebar bg-accent flex flex-col py-3 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`flex flex-col cursor-pointer items-center gap-1 py-2.5 ml-1.5 rounded-l-lg transition-colors ${
                isActive
                  ? "bg-sidebar text-secondary-foreground"
                  : "text-muted-foreground hover:bg-sidebar/50 hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[8px] leading-none font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Options sidebar */}
      <div className="hide-scrollbar flex-1 min-w-0 h-full overflow-y-auto flex flex-col gap-4 p-4 bg-sidebar">
        <div className="text-base font-semibold text-foreground">
          {tabTitles[activeTab]}
        </div>

        <PanelContent tab={activeTab} />
      </div>
    </div>
  )
}

export default LeftPanel
