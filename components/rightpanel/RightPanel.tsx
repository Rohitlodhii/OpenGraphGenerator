"use client"
import React, { useState } from 'react'
import { ImageIcon, Palette, Shapes, Type } from 'lucide-react'
import BackgroundPanel from './BackgroundPanel'
import DimensionSelector from './DimensionSelector'
import ShapesPanel from './ShapesPanel'
import TextAddingPanel from './TextAddingPanel'
import ImageAddingPanel from './ImageAddingPanel'

type RightTab = 'background' | 'shapes' | 'text' | 'images'

const tabs: { id: RightTab; label: string; icon: React.ElementType }[] = [
  { id: 'background', label: 'Background', icon: Palette },
  { id: 'shapes', label: 'Shapes', icon: Shapes },
  { id: 'text', label: 'Text', icon: Type },
  { id: 'images', label: 'Images', icon: ImageIcon },
]

const tabTitles: Record<RightTab, string> = {
  background: 'Background',
  shapes: 'Shapes',
  text: 'Text',
  images: 'Images',
}

const RightPanel = () => {
  const [activeTab, setActiveTab] = useState<RightTab>('background')

  return (
    <div className="flex h-full w-full">
      {/* Options sidebar */}
      <div className="hide-scrollbar flex-1 min-w-0 h-full overflow-y-auto flex flex-col gap-3 p-3">
        <DimensionSelector />

        <div className="text-sm font-semibold text-foreground">
          {tabTitles[activeTab]}
        </div>

        {activeTab === 'background' && <BackgroundPanel chromeless />}
        {activeTab === 'shapes' && <ShapesPanel chromeless />}
        {activeTab === 'text' && <TextAddingPanel chromeless />}
        {activeTab === 'images' && <ImageAddingPanel chromeless />}
      </div>

      {/* Icon rail (far right) */}
      <div className="w-14 shrink-0 h-full border-l border-border bg-sidebar flex flex-col py-2">
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
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] leading-none">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default RightPanel
