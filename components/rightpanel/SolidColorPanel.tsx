import React, { useRef } from 'react'
import { Popover, PopoverPopup, PopoverTrigger } from '../ui/popover'
import { useSolidColorStore } from '@/store/solidcolorstore'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { useSliderWithInput } from '@/hooks/use-slider-with-input'
import { Input } from '../ui/input'
import { ChevronsLeftRight } from 'lucide-react'
import { Sketch } from '@uiw/react-color'

export const SolidColorPanel = () => {
  const {
    color,
    setColor,
    blur,
    setBlur,
    grain,
    setGrain,
  } = useSolidColorStore()

  const handleBlurChange = React.useCallback(
    (vals: number[]) => {
      setBlur(vals[0]);
    },
    [setBlur]
  );

  const handleGrainChange = React.useCallback(
    (vals: number[]) => {
      setGrain(vals[0]);
    },
    [setGrain]
  );

  // Create refs to store reset functions
  const resetFunctionsRef = useRef<(() => void)[]>([]);

  // Function to reset all sliders to default
  const resetAll = () => {
    for (const resetFn of resetFunctionsRef.current) {
      resetFn();
    }
  };

  // Function to register reset functions
  const registerResetFunction = (resetFn: () => void, index: number) => {
    resetFunctionsRef.current[index] = resetFn;
  };

  return (
    <div className=' w-full flex flex-col gap-4 rounded-xl'>
      <div className='flex flex-col gap-2'>
        <span className='font-medium text-muted-foreground text-xs'>Color Options</span>
        
        <Popover>
          <PopoverTrigger>
            <div className='h-8 w-full flex items-center justify-between ring-1 ring-primary/10 rounded-lg px-1.5 bg-secondary'>
              <div className='flex gap-1'>
                <div className='h-5 w-5 aspect-square rounded-sm' style={{ background: color }}></div>
                <input
                  className='w-28 outline-none border-none h-5 text-muted-foreground px-2 text-sm font-medium'
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div>
                <span className='text-xs text-muted-foreground font-mono'>{"[Solid Color]"}</span>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverPopup className={"p-0 px-0 py-0"}>
            <Sketch
              style={{ borderRadius: 12 }}
              color={color}
              onChange={(colorObj) => {
                setColor(colorObj.hex);
              }}
            />
          </PopoverPopup>
        </Popover>

        <div className='flex flex-col gap-2'>
          <SliderWithInput
            defaultValue={[blur]}
            initialValue={[blur]}
            label="Blur"
            maxValue={400}
            minValue={0}
            onRegisterReset={(resetFn) => registerResetFunction(resetFn, 0)}
            onChange={handleBlurChange}
          />
          <SliderWithInput
            defaultValue={[grain]}
            initialValue={[grain]}
            label="Grain"
            maxValue={1}
            minValue={0}
            step={0.01}
            onRegisterReset={(resetFn) => registerResetFunction(resetFn, 1)}
            onChange={handleGrainChange}
          />
        </div>
      </div>
    </div>
  )
}

// helper component for sliders with numeric input
function SliderWithInput({
  minValue,
  maxValue,
  initialValue,
  defaultValue,
  label,
  onRegisterReset,
  onChange,
  step = 1,
}: {
  minValue: number;
  maxValue: number;
  initialValue: number[];
  defaultValue: number[];
  label: string;
  onRegisterReset: (resetFn: () => void) => void;
  onChange?: (value: number[]) => void;
  step?: number;
}) {
  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
    resetToDefault,
  } = useSliderWithInput({ defaultValue, initialValue, maxValue, minValue });

  React.useEffect(() => {
    onRegisterReset(resetToDefault);
  }, [onRegisterReset, resetToDefault]);

  const handleChange = React.useCallback(
    (newVals: number[]) => {
      handleSliderChange(newVals);
      if (onChange) onChange(newVals);
    },
    [handleSliderChange, onChange]
  );

  return (
    <div className="flex items-center gap-2 ring-1 ring-primary/10 px-2 rounded-lg bg-secondary">
      <span className='text-muted-foreground text-xs'>
        <ChevronsLeftRight className='h-4 w-6' />
      </span>
      <Slider
        aria-label={label}
        className="grow [&>:last-child>span]:rounded"
        max={maxValue}
        min={minValue}
        step={step}
        onValueChange={handleChange}
        value={sliderValue}
      />
      <div className='flex items-center justify-center'>
        <Input
          aria-label="Enter value"
          className="h-8 w-8 px-0   py-1 outline-none border-none shadow-none ring-0 focus-visible:ring-0"
          inputMode="decimal"
          onBlur={() => validateAndUpdateValue(inputValues[0], 0)}
          onChange={(e) => handleInputChange(e, 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              validateAndUpdateValue(inputValues[0], 0);
            }
          }}
          type="text"
          value={inputValues[0]}
        />
        <Label className="text-muted-foreground text-xs font-mono ">{`[${label}]`}</Label>
      </div>
    </div>
  );
}

export default SolidColorPanel
