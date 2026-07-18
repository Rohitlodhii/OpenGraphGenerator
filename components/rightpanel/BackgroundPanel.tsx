import React, { useState } from 'react'
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '../ui/select'
import { NewBackground } from './NewBackground'
import { SolidColorPanel } from './SolidColorPanel'
import { ImagePanel } from './ImagePanel'
import { useBackgroundStore } from '@/store/backgroundstore'
import SvgGradientPanel from './SvgGradientPanel'



const items = [
  { label: "Solid Color", value: 'solid' },
  { label: "Upload Image", value: 'image' },
  { label: "Mesh Gradients", value: 'mesh' },
  { label : "SVG Gradients" , value : 'Svg Gradient'},
  { label: "Presets", value: 'presets' },
]

type SupportedBackgroundType = 'solid' | 'mesh' | 'image' | 'Svg Gradient'

type BackgroundPanelProps = {
  isOpen?: boolean
  onToggle?: () => void
  chromeless?: boolean
}

const BackgroundPanel = ({ isOpen, onToggle, chromeless = false }: BackgroundPanelProps) => {
  const { setBackgroundType } = useBackgroundStore()
  const [selected, setSelected] = useState<string>('solid');

  const handleSelectionChange = (value: string) => {
    setSelected(value)
    if (value === 'solid' || value === 'mesh' || value === 'image' || value === 'Svg Gradient') {
      setBackgroundType(value as SupportedBackgroundType)
    }
  }

  const typeSelect = (
    <Select
      defaultValue={'solid'}
      onValueChange={(v) => handleSelectionChange(v as string)}
    >
      <SelectTrigger
        size={"sm"}
        className={chromeless
          ? "w-full border-none shadow-none ring-1 ring-primary/10 h-10 text-sm"
          : "w-[50%] border-none shadow-none ring-1 ring-primary/10 h-6"}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectPopup>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )

  const body = (
    <>
      {selected === 'solid' && <SolidColorPanel />}
      {selected === 'image' && <ImagePanel />}
      {selected === 'mesh' && <NewBackground />}
      {selected === 'Svg Gradient' && <SvgGradientPanel />}
    </>
  )

  if (chromeless) {
    return (
      <div className="flex flex-col gap-3">
        {typeSelect}
        <div className="flex flex-col">{body}</div>
      </div>
    )
  }

  return (
    <div className='border border-border flex flex-col rounded-xl items-center overflow-hidden'>
        <div
          className='flex gap-2 items-center justify-between w-full bg-sidebar h-14 px-4 border-b border-border cursor-pointer select-none'
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle?.()
            }
          }}
        >
          <span className='text-sm font-medium'>Background</span>
         {typeSelect}
        </div>

        <div className={`w-full px-4 transition-all duration-200 ${isOpen ? 'py-2' : 'max-h-0 py-0 overflow-hidden'}`}>
          {body}
        </div>

    </div>
  )
}

export default BackgroundPanel
