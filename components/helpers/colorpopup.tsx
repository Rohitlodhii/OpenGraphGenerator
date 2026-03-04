import { Sketch } from '@uiw/react-color';
import React from 'react'
import { Popover, PopoverTrigger, PopoverPopup } from '../ui/popover';

type ColorPopupProps = {
  color: string;
  onChange: (hex: string) => void;
  label?: string;
  className?: string;
};

const ColorPopup = ({ color, onChange, label = '[Color]', className = '' }: ColorPopupProps) => {
  return (
    <Popover>
      <div className={`border border-border w-full px-1.5 rounded-lg flex gap-2 h-8 items-center justify-between ${className}`}>
        <div className='flex items-center gap-2'>
          <PopoverTrigger
            className='h-5 w-5 aspect-square rounded-sm cursor-pointer border border-border p-0'
            style={{ backgroundColor: color }}
          />
          <input
            className="h-6 border-none outline-none ring-0 text-sm text-muted-foreground"
            value={color}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
        <span className='text-muted-foreground text-xs font-mono'>{label}</span>
      </div>

      <PopoverPopup className={"p-0 px-0 py-0  "}>
        <Sketch
            style={{borderRadius : 12}}
          color={color}
          onChange={(colorObj) => {
            onChange(colorObj.hex);
          }}
        />
      </PopoverPopup>
    </Popover>
  );
};

export default ColorPopup;
