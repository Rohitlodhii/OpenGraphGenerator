"use client"

import React, { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { LeftTab, tabs, tabTitles, objectTypeToTab, PanelContent } from "./panelConfig"
import { useCanvasStore } from "@/store/canvasstore"

const MobileToolbar = () => {
  const [activeTab, setActiveTab] = useState<LeftTab | null>(null)
  const objects = useCanvasStore((s) => s.objects)
  const selectedObjectId = useCanvasStore((s) => s.selectedObjectId)
  const prevSelectedRef = useRef<string | null>(null)

  // Open matching panel when an object gets selected on canvas
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

  const toggle = (id: LeftTab) =>
    setActiveTab((current) => (current === id ? null : id))

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none">
      {/* Bottom sheet - non-blocking, does not cover the whole screen */}
      {activeTab && (
        <div className="pointer-events-auto h-[22rem] rounded-t-xl border border-b-0 border-sidebar-border bg-sidebar shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-sidebar-border shrink-0">
            <span className="text-sm font-semibold text-foreground">
              {tabTitles[activeTab]}
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(null)}
              aria-label="Close panel"
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="hide-scrollbar flex-1 min-h-0 overflow-y-auto p-4">
            <PanelContent tab={activeTab} />
          </div>
        </div>
      )}

      {/* Scrollable icon bar */}
      <div className="pointer-events-auto border-t border-sidebar-border bg-sidebar">
        <div className="hide-scrollbar flex items-stretch gap-1 overflow-x-auto px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => toggle(tab.id)}
                aria-pressed={isActive}
                className={`flex shrink-0 min-w-16 flex-col cursor-pointer items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-none font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileToolbar
