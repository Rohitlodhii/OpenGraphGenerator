"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ChevronsLeftRight } from 'lucide-react'
import useSvgGradientStore from '@/store/svggradientstore'
import { useSliderWithInput } from '@/hooks/use-slider-with-input'
import { svgPaths } from '@/data/svgpaths'
import { Accordion, AccordionItem, AccordionTrigger, AccordionPanel } from '@/components/ui/accordion'
import { Select, SelectTrigger, SelectValue, SelectPopup, SelectItem } from '@/components/ui/select'
import { generateShades } from '@/lib/generateColor'
import ColorPopup from '../helpers/colorpopup'

const SvgGradientPanel: React.FC = () => {
  const { fills, blur, setBlur, backgroundColor, setBackgroundColor, offsetX, setOffsetX, offsetY, setOffsetY, pathsIndex, setIndex } =
    useSvgGradientStore()
  const svgData = svgPaths[pathsIndex]
  if (!svgData) return null

  // maintain a base color for shade generation
  const [baseColor, setBaseColor] = React.useState<string>(
    fills[0] || svgData.paths[0].fill
  )

  // when switching SVGs, reset baseColor to first fill
  React.useEffect(() => {
    setBaseColor(fills[0] || svgData.paths[0].fill)
  }, [pathsIndex])

  const handleBaseColorChange = React.useCallback(
    (color: string) => {
      setBaseColor(color)
      // generate as many shades as there are paths
      const shades = generateShades(color, svgData.paths.length)
      useSvgGradientStore.getState().setFills(shades)
    },
    [svgData.paths.length]
  )

  const handleBlurChange = React.useCallback(
    (vals: number[]) => {
      setBlur(vals[0])
    },
    [setBlur]
  )

  const handleOffsetXChange = React.useCallback(
    (vals: number[]) => {
      setOffsetX(vals[0])
    },
    [setOffsetX]
  )

  const handleOffsetYChange = React.useCallback(
    (vals: number[]) => {
      setOffsetY(vals[0])
    },
    [setOffsetY]
  )

  return (
    <div className='w-full flex flex-col gap-4 rounded-xl pb-4'>
      {/* SVG Path Selection */}
      <div className='flex flex-col gap-2'>
        <span className='font-medium text-muted-foreground text-xs'>SVG Gradient</span>
        <Select value={pathsIndex.toString()} onValueChange={(v) => setIndex(Number(v))}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select gradient' />
          </SelectTrigger>
          <SelectPopup>
            {svgPaths.map((path, idx) => (
              <SelectItem key={idx} value={idx.toString()}>
                {path.name}
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      </div>

      {/* Background Color Section */}
      <div className='flex flex-col gap-2'>
        <span className='font-medium text-muted-foreground text-xs'>Colors</span>
       
        
          <ColorPopup color={backgroundColor} onChange={setBackgroundColor} label='[Background]' />
          <ColorPopup color={baseColor} onChange={handleBaseColorChange} label='[Base Color]' />
     
      </div>

      {/* Effects Section */}
      <div className='flex flex-col gap-2'>
        <span className='font-medium text-muted-foreground text-xs'>Effects</span>
        <SliderWithInput
          defaultValue={[blur]}
          initialValue={[blur]}
          label='Blur'
          maxValue={50}
          minValue={0}
          step={1}
          onChange={handleBlurChange}
        />
      </div>

      {/* Position Section */}
      <div className='flex flex-col gap-2'>
        <span className='font-medium text-muted-foreground text-xs'>Position</span>
        <SliderWithInput
          defaultValue={[offsetX]}
          initialValue={[offsetX]}
          label='X'
          maxValue={200}
          minValue={-200}
          step={1}
          onChange={handleOffsetXChange}
        />
        <SliderWithInput
          defaultValue={[offsetY]}
          initialValue={[offsetY]}
          label='Y'
          maxValue={200}
          minValue={-200}
          step={1}
          onChange={handleOffsetYChange}
        />
      </div>

      {/* Advanced Settings with Path Colors */}
      <Accordion  >
        <AccordionItem value="advanced-settings">
          <AccordionTrigger className={"text-muted-foreground"}>Edit Path Colors</AccordionTrigger>
          <AccordionPanel>
            <div className='flex flex-col gap-4'>
                     

             
                <div className='flex flex-col gap-2'>
                  {svgData.paths.map((p, idx) => {
                    const currentFill = fills?.[idx] ?? p.fill
                    return (
                      <div key={idx} className='flex items-center gap-2'>
                        {/* <input
                          aria-label={`fill-input-${idx}`}
                          type='color'
                          value={currentFill}
                          onChange={(e) => useSvgGradientStore.getState().setFill(idx, e.target.value)}
                          className='h-8 w-8 cursor-pointer border-none outline-none rounded'
                        />
                        <div className='text-xs text-muted-foreground font-mono'>Path {idx + 1}</div> */}
                        <ColorPopup color={currentFill} onChange={(color) => useSvgGradientStore.getState().setFill(idx, color)} label={`[ Path ${idx + 1}]`}/>
                      </div>
                    )
                  })}
                </div>
              
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

// Slider with numeric input helper
function SliderWithInput({
  minValue,
  maxValue,
  initialValue,
  defaultValue,
  label,
  onChange,
  step = 1,
}: {
  minValue: number
  maxValue: number
  initialValue: number[]
  defaultValue: number[]
  label: string
  onChange?: (value: number[]) => void
  step?: number
}) {
  const { sliderValue, inputValues, validateAndUpdateValue, handleInputChange, handleSliderChange } =
    useSliderWithInput({ defaultValue, initialValue, maxValue, minValue })

  const handleChange = React.useCallback(
    (newVals: number[]) => {
      handleSliderChange(newVals)
      if (onChange) onChange(newVals)
    },
    [handleSliderChange, onChange]
  )

  return (
    <div className='flex items-center gap-2 ring-1 ring-primary/10 px-2 rounded-lg bg-secondary'>
      <span className='text-muted-foreground text-xs'>
        <ChevronsLeftRight className='h-4 w-6' />
      </span>
      <Slider
        aria-label={label}
        className='grow [&>:last-child>span]:rounded'
        max={maxValue}
        min={minValue}
        step={step}
        onValueChange={handleChange}
        value={sliderValue}
      />
      <div className='flex items-center justify-center'>
        <Input
          aria-label='Enter value'
          className='h-8 w-8 px-0 py-1 outline-none border-none shadow-none ring-0 focus-visible:ring-0'
          inputMode='decimal'
          onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
          onChange={(e) => handleInputChange(e, 0)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              validateAndUpdateValue(inputValues[0], 0)
            }
          }}
          type='text'
          value={inputValues[0]}
        />
        <Label className='text-muted-foreground text-xs font-mono'>{`[${label}]`}</Label>
      </div>
    </div>
  )
}

export default SvgGradientPanel
