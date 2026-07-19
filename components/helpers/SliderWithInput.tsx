"use client"

import React from "react"
import { ChevronsLeftRight } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { useSliderWithInput } from "@/hooks/use-slider-with-input"

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
  const {
    sliderValue,
    inputValues,
    validateAndUpdateValue,
    handleInputChange,
    handleSliderChange,
  } = useSliderWithInput({ defaultValue, initialValue, maxValue, minValue })

  const handleChange = React.useCallback(
    (newVals: number[]) => {
      handleSliderChange(newVals)
      if (onChange) onChange(newVals)
    },
    [handleSliderChange, onChange],
  )

  const commitInputValue = React.useCallback(() => {
    const rawValue = inputValues[0]
    validateAndUpdateValue(rawValue, 0)
    if (!onChange) return
    if (rawValue === "" || rawValue === "-") {
      onChange([minValue])
      return
    }
    const parsed = Number.parseFloat(rawValue)
    if (Number.isNaN(parsed)) {
      onChange(sliderValue)
      return
    }
    onChange([Math.max(minValue, Math.min(maxValue, parsed))])
  }, [inputValues, maxValue, minValue, onChange, sliderValue, validateAndUpdateValue])

  return (
    <div className="flex items-center gap-2 ring-1 ring-primary/10 px-2 py-0.5 rounded-lg bg-secondary">
      <span className="text-muted-foreground text-xs">
        <ChevronsLeftRight className="h-4 w-5" />
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
      <div className="flex items-center justify-center">
        <Input
          aria-label={`Enter ${label}`}
          className="h-7 w-10 px-0 py-0 text-sm text-center outline-none border-none shadow-none ring-0 focus-visible:ring-0"
          inputMode="decimal"
          onBlur={commitInputValue}
          onChange={(e) => handleInputChange(e, 0)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitInputValue()
            }
          }}
          type="text"
          value={inputValues[0]}
        />
        <Label className="text-muted-foreground text-xs font-mono">{`[${label}]`}</Label>
      </div>
    </div>
  )
}

export default SliderWithInput
