"use client"
import React, { useState } from 'react'
import BackgroundPanel from './BackgroundPanel'
import DimensionSelector from './DimensionSelector'
import ShapesPanel from './ShapesPanel'
import TextAddingPanel from './TextAddingPanel'
import ImageAddingPanel from './ImageAddingPanel'


const RightPanel = () => {
  const [expandedPanel, setExpandedPanel] = useState<'background' | 'shapes' | 'text' | 'images' | null>('background')

  return (
    <div className='hide-scrollbar flex flex-col gap-2 w-full h-full p-2 overflow-y-auto [&>*]:shrink-0'>
        <DimensionSelector/>
       
        <BackgroundPanel
          isOpen={expandedPanel === 'background'}
          onToggle={() =>
            setExpandedPanel((prev) => (prev === 'background' ? null : 'background'))
          }
        />
        <ShapesPanel
          isOpen={expandedPanel === 'shapes'}
          onToggle={() =>
            setExpandedPanel((prev) => (prev === 'shapes' ? null : 'shapes'))
          }
        />
        <TextAddingPanel
          isOpen={expandedPanel === 'text'}
          onToggle={() =>
            setExpandedPanel((prev) => (prev === 'text' ? null : 'text'))
          }
        />
        <ImageAddingPanel
          isOpen={expandedPanel === 'images'}
          onToggle={() =>
            setExpandedPanel((prev) => (prev === 'images' ? null : 'images'))
          }
        />
    </div>
  )
}

export default RightPanel
