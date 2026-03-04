import React, { useState } from 'react'
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '../ui/select'
import BackgroundColorPicker from './BackgroundColorPicker'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import ColorPopup from '../helpers/colorpopup'
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


const BackgroundPanel = () => {
  const { setBackgroundType } = useBackgroundStore()
  const [selected, setSelected] = useState<string>('solid');
   const [hex, setHex] = useState("#fff");

  const handleSelectionChange = (value: string) => {
    setSelected(value)
    setBackgroundType(value as any)
  }
  return (
    <div className='border border-border flex flex-col gap-2 rounded-xl  items-center overflow-hidden'>
        <div className='flex gap-2 items-center justify-between w-full bg-sidebar h-14 px-4 border-b border-border'>  
          <span className='text-sm font-medium'>Background</span>
         <Select defaultValue={'solid'} onValueChange={(v) => handleSelectionChange(v as string)}>
          <SelectTrigger  size={"sm"} className="w-[50%] border-none shadow-none ring-1 ring-primary/10 h-6">
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
        </div>
       

        
        

         
        

        <div className='w-full py-2 px-4 '>
          {selected === 'solid' && <SolidColorPanel />}
          {selected === 'image' && <ImagePanel />}
          {selected === 'mesh' && <NewBackground />}
          {selected === 'Svg Gradient' && <SvgGradientPanel />}
        </div>

    </div>
  )
}

export default BackgroundPanel
