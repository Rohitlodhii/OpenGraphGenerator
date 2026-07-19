"use client"

import React, { useMemo } from "react"
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  ItalicIcon,
  Plus,
  Trash2,
  Type,
  UnderlineIcon,
} from "lucide-react"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { CanvasTextAlign, useCanvasStore } from "@/store/canvasstore"
import ColorPopup from "../helpers/colorpopup"
import SliderWithInput from "../helpers/SliderWithInput"
import { ToggleGroup } from "../ui/toggle-group"
import { Toggle } from "../ui/toggle"
import FontPicker from "./FontPicker"
import { familyNameFromValue } from "@/lib/fonts"

type TextAddingPanelProps = {
  isOpen?: boolean
  onToggle?: () => void
  chromeless?: boolean
}

type TextFormattingValue = "bold" | "italic" | "underline"

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `text-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const TextAddingPanel = ({ isOpen, onToggle, chromeless = false }: TextAddingPanelProps) => {
  const expanded = chromeless ? true : isOpen
  const {
    objects,
    selectedObjectId,
    addObject,
    updateObject,
    removeObject,
    setSelectedObjectId,
  } = useCanvasStore()

  const textObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "text")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  const selectedTextObject = useMemo(() => {
    const selected = textObjects.find((obj) => obj.id === selectedObjectId)
    return selected ?? null
  }, [selectedObjectId, textObjects])

  const handleAddText = () => {
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    addObject({
      id: createId(),
      type: "text",
      content: "Add your text",
      x: 72,
      y: 72,
      width: 360,
      height: 90,
      zIndex: maxZIndex + 1,
      fontSize: 36,
      fontFamily: "Poppins, sans-serif",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: 0,
      fontOpacity: 100,
      fontStyle: "normal",
      textDecoration: "none",
      textAlign: "left",
      textIndent: 0,
      textColor: "#ffffff",
      textShadow: 0,
      textShadowColor: "#000000",
    })
  }

  const updateNumberField = (field: "fontSize" | "x" | "y" | "width" | "height", value: string) => {
    if (!selectedTextObject) return
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return

    if (field === "fontSize") {
      updateObject(selectedTextObject.id, { fontSize: Math.max(8, Math.min(300, parsed)) })
      return
    }
    if (field === "width" || field === "height") {
      updateObject(selectedTextObject.id, { [field]: Math.max(24, parsed) })
      return
    }
    updateObject(selectedTextObject.id, { [field]: parsed })
  }

  const setAlign = (align: CanvasTextAlign) => {
    if (!selectedTextObject) return
    updateObject(selectedTextObject.id, { textAlign: align })
  }

  const activeFormatting = useMemo(() => {
    if (!selectedTextObject) return []
    const values: TextFormattingValue[] = []
    if ((selectedTextObject.fontWeight ?? 400) >= 700) values.push("bold")
    if ((selectedTextObject.fontStyle ?? "normal") === "italic") values.push("italic")
    if ((selectedTextObject.textDecoration ?? "none") === "underline") values.push("underline")
    return values
  }, [selectedTextObject])

  const setFormatting = (values: string[]) => {
    if (!selectedTextObject) return
    const formattingValues = values.filter(
      (value): value is TextFormattingValue =>
        value === "bold" || value === "italic" || value === "underline",
    )
    updateObject(selectedTextObject.id, {
      fontWeight: formattingValues.includes("bold") ? 700 : 400,
      fontStyle: formattingValues.includes("italic") ? "italic" : "normal",
      textDecoration: formattingValues.includes("underline") ? "underline" : "none",
    })
  }

  const compactButton = "h-8 rounded-md px-3 text-xs"

  return (
    <div
      className={
        chromeless
          ? "flex w-full flex-col"
          : "border border-border  flex flex-col rounded-xl items-center overflow-hidden"
      }
    >
      {!chromeless && (
        <div
          className="flex gap-2 items-center justify-between w-full bg-sidebar h-14 px-4 border-b border-border cursor-pointer select-none"
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              onToggle?.()
            }
          }}
        >
          <span className="text-sm font-medium">Text</span>
          <Type className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      <div
        className={
          chromeless
            ? "w-full"
            : `w-full px-4 transition-all duration-200 ${expanded ? "py-3" : "max-h-0 py-0 overflow-hidden"
              }`
        }
      >
        <div className="w-full flex flex-col gap-3">
          <Button size="sm" variant="secondary" className={`w-full ${compactButton}`} onClick={handleAddText}>
            <Plus className="h-4 w-4" />
            Add Text
          </Button>

          {textObjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted-foreground font-medium">Text Layers</span>
              <div className="flex flex-col gap-1.5">
                {textObjects.map((item) => (
                  <div
                    key={item.id}
                    className={`h-8 border rounded-md px-3 flex items-center justify-between gap-2 ${selectedObjectId === item.id ? "border-primary" : "border-border"
                      }`}
                  >
                    <button
                      className="text-sm text-left truncate flex-1"
                      onClick={() => setSelectedObjectId(item.id)}
                    >
                      {(item.content ?? "Text").slice(0, 22)}
                    </button>
                    <button
                      className="text-destructive"
                      onClick={() => removeObject(item.id)}
                      aria-label="Delete text"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTextObject && (
            <>
              <Textarea
                value={selectedTextObject.content ?? ""}
                onChange={(event) => updateObject(selectedTextObject.id, { content: event.target.value })}
                className="bg-secondary"
                rows={3}
              />
              <ColorPopup
                color={selectedTextObject.textColor ?? "#ffffff"}
                onChange={(hex) => updateObject(selectedTextObject.id, { textColor: hex })}
                label="[Text Color]"
                className="bg-secondary"
              />
            

              <div className="flex flex-col gap-2 w-full">

                <h2 className="font-medium text-xs text-muted-foreground">Decoration</h2>

                <section className="flex flex-row items-center justify-between w-full">

                  <div className="flex gap-1">
                    <ToggleGroup value={activeFormatting} multiple onValueChange={setFormatting} size="sm" variant="outline">
                      <Toggle aria-label="Toggle bold" value="bold" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <BoldIcon />
                      </Toggle>
                      <Toggle aria-label="Toggle italic" value="italic" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <ItalicIcon />
                      </Toggle>
                      <Toggle aria-label="Toggle underline" value="underline" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <UnderlineIcon />
                      </Toggle>
                    </ToggleGroup>
                  </div>

                  <div className="flex gap-1">
                    <ToggleGroup
                      value={[selectedTextObject.textAlign ?? "left"]}
                      onValueChange={(values) => {
                        const nextAlign = values[0] as CanvasTextAlign | undefined
                        if (!nextAlign) return
                        setAlign(nextAlign)
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <Toggle aria-label="Align left" value="left" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <AlignLeft />
                      </Toggle>
                      <Toggle aria-label="Align center" value="center" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <AlignCenter />
                      </Toggle>
                      <Toggle aria-label="Align right" value="right" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <AlignRight />
                      </Toggle>
                      <Toggle aria-label="Align justify" value="justify" className="h-8 min-w-8 sm:h-8 sm:min-w-8">
                        <AlignJustify />
                      </Toggle>
                    </ToggleGroup>
                  </div>

                </section>


              </div>

            <div className="flex flex-col gap-2">
                  <SliderWithInput
                    key={`fontsize-${selectedTextObject.id}`}
                    defaultValue={[selectedTextObject.fontSize ?? 36]}
                    initialValue={[selectedTextObject.fontSize ?? 36]}
                    label="Size"
                    maxValue={250}
                    minValue={8}
                    onChange={(vals) => updateObject(selectedTextObject.id, { fontSize: vals[0] })}
                  />

                  <SliderWithInput
                    key={`lineheight-${selectedTextObject.id}`}
                    defaultValue={[selectedTextObject.lineHeight ?? 1.2]}
                    initialValue={[selectedTextObject.lineHeight ?? 1.2]}
                    label="Leading"
                    maxValue={3}
                    minValue={0.8}
                    step={0.05}
                    onChange={(vals) => updateObject(selectedTextObject.id, { lineHeight: vals[0] })}
                  />

                  <SliderWithInput
                    key={`tracking-${selectedTextObject.id}`}
                    defaultValue={[selectedTextObject.letterSpacing ?? 0]}
                    initialValue={[selectedTextObject.letterSpacing ?? 0]}
                    label="Tracking"
                    maxValue={40}
                    minValue={-10}
                    step={0.5}
                    onChange={(vals) => updateObject(selectedTextObject.id, { letterSpacing: vals[0] })}
                  />

                  <SliderWithInput
                    key={`fontweight-${selectedTextObject.id}`}
                    defaultValue={[selectedTextObject.fontWeight ?? 700]}
                    initialValue={[selectedTextObject.fontWeight ?? 700]}
                    label="Weight"
                    maxValue={900}
                    minValue={100}
                    step={100}
                    onChange={(vals) => updateObject(selectedTextObject.id, { fontWeight: vals[0] })}
                  />

                  <SliderWithInput
                    key={`fontopacity-${selectedTextObject.id}`}
                    defaultValue={[selectedTextObject.fontOpacity ?? 100]}
                    initialValue={[selectedTextObject.fontOpacity ?? 100]}
                    label="Opacity"
                    maxValue={100}
                    minValue={0}
                    onChange={(vals) => updateObject(selectedTextObject.id, { fontOpacity: vals[0] })}
                  />
            </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xs font-medium text-muted-foreground">Text Shadow</h2>
                <ColorPopup
                  color={selectedTextObject.textShadowColor ?? "#000000"}
                  onChange={(hex) => updateObject(selectedTextObject.id, { textShadowColor: hex })}
                  label="[Shadow]"
                  className="bg-secondary"
                />
                <SliderWithInput
                  key={`shadow-${selectedTextObject.id}`}
                  defaultValue={[selectedTextObject.textShadow ?? 0]}
                  initialValue={[selectedTextObject.textShadow ?? 0]}
                  label="Offset"
                  maxValue={50}
                  minValue={0}
                  onChange={(vals) => updateObject(selectedTextObject.id, { textShadow: vals[0] })}
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">Font Family</span>
                <FontPicker
                  value={selectedTextObject.fontFamily}
                  selectedFamily={familyNameFromValue(selectedTextObject.fontFamily) ?? "Poppins"}
                  onSelect={(fontFamilyValue) =>
                    updateObject(selectedTextObject.id, { fontFamily: fontFamilyValue })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex gap-2 h-8 border border-border rounded-md px-3 items-center">
                  <span className="text-xs text-muted-foreground">X</span>
                  <input
                    type="number"
                    value={Math.round(selectedTextObject.x)}
                    onChange={(event) => updateNumberField("x", event.target.value)}
                    className="h-full border-0 ring-0 outline-0 text-xs w-full bg-transparent"
                  />
                </div>
                <div className="flex gap-2 h-8 border border-border rounded-md px-3 items-center">
                  <span className="text-xs text-muted-foreground">Y</span>
                  <input
                    type="number"
                    value={Math.round(selectedTextObject.y)}
                    onChange={(event) => updateNumberField("y", event.target.value)}
                    className="h-full border-0 ring-0 outline-0 text-xs w-full bg-transparent"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextAddingPanel
