import React, { useRef, useCallback, useEffect } from 'react'
import { Popover, PopoverPopup, PopoverTrigger } from '../ui/popover'
import { useMeshStore } from '@/store/meshstore'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'
import { useSliderWithInput } from '@/hooks/use-slider-with-input'
import { Input } from '../ui/input'
import { ChevronsLeftRight, DeleteIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Sketch } from '@uiw/react-color'

export const NewBackground = () => {

  const {
    baseColor,
    setBaseColor,
    blur,
    setBlur,
    grain,
    setGrain,
    blobs,
    addBlob,
    removeBlob,
    updateBlob,
  } = useMeshStore()

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
    <div className=' w-full flex flex-col gap-4 rounded-xl pb-4'>
      <div className='flex flex-col gap-2'>


        <span className='font-medium text-muted-foreground text-xs'>Base Options</span>
        <Popover>
          <PopoverTrigger>
            <div className='h-8 w-full flex items-center justify-between ring-1 ring-primary/10 rounded-lg px-1.5 bg-secondary'>

              <div className='flex gap-1'>
                <div className='h-5 w-5 aspect-square rounded-sm ' style={{ background: baseColor }}></div>
                <input className='w-28 outline-none border-none h-5 text-muted-foreground px-2 text-sm font-medium' value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
              </div>

              <div>
                <span className='text-xs text-muted-foreground  font-mono'>{"[Base Color]"}</span>
              </div>

            </div>
          </PopoverTrigger>
          <PopoverPopup className={"p-0 px-0 py-0  "}>
            <Sketch
              style={{ borderRadius: 12 }}
              color={baseColor}
              onChange={(colorObj) => {
                setBaseColor(colorObj.hex);
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

      <div className='flex flex-col gap-4'>

        <div className='flex w-full items-center justify-between'>
          <span className='font-medium text-muted-foreground text-xs'>Blob Colors</span>
          <Button className=' h-5 rounded-sm cursor-pointer outline-0 ring-1 ring-primary/10 hover:ring-amber-600/60 bg-secondary group ' size={'sm'} variant={"ghost"} onClick={() => addBlob('#ff0080')}>
            <PlusIcon />
             <span className=' h-full ring-1 ring-primary/10 group-hover:ring-amber-600/60 mr-1'></span>
            <span className='font-mono'>Add Color</span>
          </Button>
        </div>

              <div className='flex flex-col gap-2'>
      
        {/* Render all blobs */}
        {blobs.map((blob, index) => (
          <div key={index} className='flex gap-1 items-center '>
            <div className=' h-8 w-full flex items-center justify-between ring-1 ring-primary/10 rounded-lg px-1.5 bg-secondary '>
              <div className='flex gap-1 items-center justify-center'>
                <Popover>
                  <PopoverTrigger>
                    <div className='h-5 w-5 aspect-square rounded-sm' style={{ background: blob.color }}></div>
                  </PopoverTrigger>
                  <PopoverPopup className={"p-0 px-0 py-0"}>
                    <Sketch
                      style={{ borderRadius: 12 }}
                      color={blob.color}
                      onChange={(colorObj) => {
                        updateBlob(index, { color: colorObj.hex });
                      }}
                    />
                  </PopoverPopup>
                </Popover>
                <input
                  className='w-20 outline-none border-none h-5 text-muted-foreground px-2 text-sm font-medium text-left bg-transparent'
                  value={blob.color}
                  onChange={(e) => updateBlob(index, { color: e.target.value })}
                />
              </div>
              <TransparencyControl
                opacity={blob.opacity}
                onOpacityChange={(newOpacity) => updateBlob(index, { opacity: newOpacity })}
              />
            </div>
            <Button
              className='cursor-pointer hover:ring hover:ring-primary/10 aspect-square text-muted-foreground hover:text-destructive'
              size={'icon'}
              variant={"ghost"}
              onClick={() => removeBlob(index)}
            >
              <TrashIcon />
            </Button>
          </div>
        ))}

                  
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

// Custom transparency control with drag
function TransparencyControl({
  opacity,
  onOpacityChange,
}: {
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(Math.round(opacity * 100).toString());
  const percentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setInputValue(Math.round(opacity * 100).toString());
  }, [opacity]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!percentRef.current) return;
      const rect = percentRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      onOpacityChange(percentage);
      setInputValue(Math.round(percentage * 100).toString());
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onOpacityChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setInputValue(newVal);
    const numVal = Number.parseInt(newVal, 10);
    if (!Number.isNaN(numVal)) {
      const clamped = Math.max(0, Math.min(100, numVal));
      onOpacityChange(clamped / 100);
    }
  };

  const handleInputBlur = () => {
    const numVal = Number.parseInt(inputValue, 10);
    if (Number.isNaN(numVal)) {
      setInputValue(Math.round(opacity * 100).toString());
    } else {
      const clamped = Math.max(0, Math.min(100, numVal));
      setInputValue(clamped.toString());
      onOpacityChange(clamped / 100);
    }
  };

  return (
    <div className='flex items-center gap-0.5 select-none'>
      <input
        type='text'
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        className='h-5 w-8 px-1 text-xs font-mono text-muted-foreground bg-transparent border-none outline-none text-right'
        inputMode='numeric'
      />
      <div
        ref={percentRef}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`flex items-center px-1 py-0.5 rounded select-none transition-colors ${
          isHovering || isDragging
            ? 'cursor-ew-resize bg-muted'
            : 'cursor-default'
        }`}
        style={{
          userSelect: 'none',
        }}
      >
      
        <span className='text-muted-foreground text-xs'>%</span>
       
      </div>
    </div>
  );
}



