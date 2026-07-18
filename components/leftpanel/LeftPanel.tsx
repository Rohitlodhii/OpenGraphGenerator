"use client"

import AppHeader from "./AppHeader"
import PresetManager from "./PresetManager"
import TemplateBrowser from "./TemplateBrowser"

type LeftPanelProps = {
  hideHeader?: boolean
}

const LeftPanel = ({ hideHeader = false }: LeftPanelProps) => {
  return (
    <div className='flex flex-col gap-2 w-full h-full p-4'>
        {!hideHeader && <AppHeader />}
        <TemplateBrowser />
        <PresetManager />
    </div>
  )
}

export default LeftPanel
