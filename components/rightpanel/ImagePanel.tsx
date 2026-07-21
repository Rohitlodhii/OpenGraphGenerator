import React, { useRef } from "react"
import { useImageStore } from "@/store/imagestore"
import { Slider } from "../ui/slider"
import { useSliderWithInput } from "@/hooks/use-slider-with-input"
import { ChevronsLeftRight, Upload, X } from "lucide-react"
import { useBackgroundStore } from "@/store/backgroundstore"

export const ImagePanel = () => {
  const {
    src,
    blur,
    grain,
    saturation,
    contrast,
    brightness,
    opacity,
    setSrc,
    setBlur,
    setGrain,
    setSaturation,
    setContrast,
    setBrightness,
    setOpacity,
  } = useImageStore()
  const setBackgroundType = useBackgroundStore((state) => state.setBackgroundType)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setSrc(url)
    }
  }

  const handleRemoveImage = () => {
    setSrc(null)
    setBackgroundType("solid")
  }

  const handleSlider =
    (setter: (v: number) => void) => (vals: number[]) =>
      setter(vals[0])

  const registerResetRef = useRef<(() => void)[]>([])
  const register = (fn: () => void, i: number) => {
    registerResetRef.current[i] = fn
  }

  return (
    <div className="w-full flex flex-col gap-4 rounded-xl pb-2">
      {src && (
        <div className="overflow-hidden rounded-lg border border-border bg-muted/40">
          <img
            src={src}
            alt="Current background"
            className="h-24 w-full object-cover"
            style={{ opacity: Math.max(0, Math.min(100, opacity)) / 100 }}
          />
        </div>
      )}

      {/* Upload */}
      <div className="flex flex-col gap-2">
        {!src ? (
          <label className="flex items-center justify-center gap-2 px-3 py-2 bg-muted/40 border border-border/40 rounded-xl cursor-pointer hover:bg-muted transition">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <span className="text-sm text-muted-foreground w-4 h-4 flex items-center justify-center"><Upload/></span>
            <span className="text-sm">Upload Image</span>
          </label>
        ) : (
          <button
            onClick={handleRemoveImage}
            className="flex items-center justify-center gap-2 px-3 py-2 bg-muted/40 border border-border/40 rounded-xl cursor-pointer hover:bg-destructive/10 hover:border-destructive/40 transition"
          >
            <span className="text-sm text-muted-foreground w-4 h-4 flex items-center justify-center"><X/></span>
            <span className="text-sm">Unset Background</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        <SliderRow
          label="Opacity"
          value={opacity}
          min={0}
          max={100}
          onRegisterReset={(fn) => register(fn, 0)}
          onChange={handleSlider(setOpacity)}
        />
        <SliderRow
          label="Blur"
          value={blur}
          min={0}
          max={30}
          onRegisterReset={(fn) => register(fn, 1)}
          onChange={handleSlider(setBlur)}
        />

        <SliderRow
          label="Grain"
          value={grain}
          min={0}
          max={1}
          step={0.01}
          onRegisterReset={(fn) => register(fn, 2)}
          onChange={handleSlider(setGrain)}
        />

        <SliderRow
          label="Saturation"
          value={saturation}
          min={0}
          max={3}
          step={0.01}
          onRegisterReset={(fn) => register(fn, 3)}
          onChange={handleSlider(setSaturation)}
        />

        <SliderRow
          label="Contrast"
          value={contrast}
          min={0}
          max={3}
          step={0.01}
          onRegisterReset={(fn) => register(fn, 4)}
          onChange={handleSlider(setContrast)}
        />

        <SliderRow
          label="Brightness"
          value={brightness}
          min={0}
          max={3}
          step={0.01}
          onRegisterReset={(fn) => register(fn, 5)}
          onChange={handleSlider(setBrightness)}
        />
      </div>
    </div>
  )
}

function SliderRow({
  label,
  value,
  min,
  max,
  step = 1,
  onRegisterReset,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onRegisterReset: (resetFn: () => void) => void
  onChange?: (value: number[]) => void
}) {
  const {
    sliderValue,
    handleSliderChange,
    resetToDefault,
  } = useSliderWithInput({
    defaultValue: [value],
    initialValue: [value],
    maxValue: max,
    minValue: min,
  })

  React.useEffect(() => {
    onRegisterReset(resetToDefault)
  }, [onRegisterReset, resetToDefault])

  const handleChange = React.useCallback(
    (newVals: number[]) => {
      handleSliderChange(newVals)
      if (onChange) onChange(newVals)
    },
    [handleSliderChange, onChange]
  )

  return (
  <div className="flex items-center gap-3 bg-muted/40 border border-border/40 rounded-lg h-8 px-1.5">

    {/* Icon */}
    <div className="w-5 flex justify-center">
      <ChevronsLeftRight className="h-3.5 w-3.5 text-muted-foreground" />
    </div>

    {/* Slider (more space now) */}
    <div className="flex-1 px-2">
      <Slider
        aria-label={label}
        max={max}
        min={min}
        step={step}
        value={sliderValue}
        onValueChange={handleChange}
      />
    </div>

    {/* Value */}
    <div className="w-12 text-right text-xs font-medium">
      {sliderValue[0]}
    </div>

    {/* Label */}
    <div className="w-18 text-center text-xs font-medium text-muted-foreground">
      [{label}]
    </div>

  </div>
)
}

export default ImagePanel
