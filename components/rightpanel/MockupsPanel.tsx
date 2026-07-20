"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { ImageDown, Plus, RotateCw, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import ColorPopup from "../helpers/colorpopup"
import { CanvasObject, useCanvasStore } from "@/store/canvasstore"
import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "../ui/accordion"
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select"
import { mockups, getMockup, MockupDef } from "../mockups/registry"

type MockupsPanelProps = {
  chromeless?: boolean
}

const DEFAULT_SCREEN_COLOR = "#111827"

const createId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `mockup-${Date.now()}-${Math.floor(Math.random() * 100000)}`
}

const MockupsPanel = ({ chromeless = false }: MockupsPanelProps) => {
  const { objects, addObject, updateObject, removeObject } = useCanvasStore()
  const selectedObjectId = useCanvasStore((state) => state.selectedObjectId)
  const [activeMockup, setActiveMockup] = useState<string>(mockups[0]?.id ?? "iphone")
  const [openItems, setOpenItems] = useState<string[]>([])

  const mockupObjects = useMemo(
    () =>
      [...objects]
        .filter((object) => object.type === "mockup")
        .sort((a, b) => (b.zIndex ?? 0) - (a.zIndex ?? 0)),
    [objects],
  )

  // Auto-expand a mockup's controls when it's selected on the canvas.
  useEffect(() => {
    if (!selectedObjectId) return
    const isMockup = mockupObjects.some((m) => m.id === selectedObjectId)
    if (!isMockup) return
    setOpenItems((prev) => (prev.includes(selectedObjectId) ? prev : [...prev, selectedObjectId]))
  }, [selectedObjectId, mockupObjects])

  const handleAddMockup = () => {
    const def = getMockup(activeMockup)
    if (!def) return
    const maxZIndex = objects.reduce((max, object) => Math.max(max, object.zIndex ?? 0), 0)
    const width = def.defaultWidth
    const height = Math.round(width / def.aspect)

    addObject({
      id: createId(),
      type: "mockup",
      mockupId: def.id,
      mockupImageFit: "cover",
      mockupUrl: def.hasUrl ? "https://example.com" : undefined,
      fill: DEFAULT_SCREEN_COLOR,
      x: 60,
      y: 60,
      width,
      height,
      rotation: 0,
      zIndex: maxZIndex + 1,
    })
  }

  return (
    <div className={chromeless ? "flex w-full flex-col gap-3" : "flex w-full flex-col gap-3 p-1"}>
      {/* Device picker */}
      <div className="grid grid-cols-2 gap-2">
        {mockups.map((def) => {
          const isActive = activeMockup === def.id
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => setActiveMockup(def.id)}
              aria-pressed={isActive}
              title={def.name}
              className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-3 text-foreground transition-colors ${
                isActive ? "border-primary bg-accent" : "border-border hover:bg-accent/50"
              }`}
            >
              <span className="flex h-16 w-full items-center justify-center overflow-hidden text-muted-foreground">
                <MockupThumb def={def} />
              </span>
              <span className="text-[11px] font-medium">{def.name}</span>
            </button>
          )
        })}
      </div>

      <Button size="sm" variant="secondary" className="h-9 w-full rounded-md text-sm" onClick={handleAddMockup}>
        <Plus className="h-4 w-4" />
        Add Mockup
      </Button>

      {mockupObjects.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">Mockup Layers</span>
          <Accordion value={openItems} onValueChange={(value) => setOpenItems(value as string[])}>
            {mockupObjects.map((mockup) => (
              <MockupLayerControls
                key={mockup.id}
                mockup={mockup}
                onUpdate={(updates) => updateObject(mockup.id, updates)}
                onRemove={() => removeObject(mockup.id)}
              />
            ))}
          </Accordion>
        </div>
      )}
    </div>
  )
}

// Small preview of a device, tinted with a neutral screen so it reads in the picker.
const MockupThumb = ({ def }: { def: MockupDef }) => {
  const { Component } = def
  return (
    <span style={{ color: "#e5e7eb", display: "block", height: "100%" }}>
      <Component
        width={def.nativeWidth}
        height={def.nativeHeight}
        fit="cover"
        style={{ display: "block", height: "100%", width: "auto", maxWidth: "100%" }}
      />
    </span>
  )
}

const MockupLayerControls = ({
  mockup,
  onUpdate,
  onRemove,
}: {
  mockup: CanvasObject
  onUpdate: (updates: Partial<CanvasObject>) => void
  onRemove: () => void
}) => {
  const def = getMockup(mockup.mockupId)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeInput =
    "h-8 w-full min-w-0 flex-1 rounded-md px-2 text-xs focus-visible:ring-0 focus-visible:border-input"

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    // Embed the uploaded image inside the device screen.
    const src = URL.createObjectURL(file)
    onUpdate({ src })
    event.target.value = ""
  }

  return (
    <AccordionItem
      value={mockup.id}
      className="border border-border rounded-md my-1 bg-card overflow-hidden"
    >
      <AccordionTrigger className="w-full h-8 px-2 flex items-center justify-between gap-2 py-0 text-xs text-muted-foreground [&_[data-slot=accordion-indicator]]:hidden">
        <span className="text-xs capitalize">{def?.name ?? "Mockup"}</span>
        <div
          role="button"
          tabIndex={0}
          className="h-8 w-8 rounded-md p-0 shrink-0 text-destructive flex items-center justify-center"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRemove()
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              event.stopPropagation()
              onRemove()
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </div>
      </AccordionTrigger>

      <AccordionPanel className="pb-0 border-t border-border">
        <div className="flex flex-col gap-2 p-2">
          {/* Screen image */}
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
            Screen Image
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <Button
            size="sm"
            variant="secondary"
            className="h-8 rounded-md px-3 text-xs"
            onClick={() => fileInputRef.current?.click()}
          >
            {mockup.src ? <ImageDown className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {mockup.src ? "Replace Image" : "Upload Image"}
          </Button>
          {mockup.src && (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">Image Fit</span>
                <Select
                  value={mockup.mockupImageFit ?? "cover"}
                  onValueChange={(value) =>
                    onUpdate({ mockupImageFit: (value as "cover" | "contain") || "cover" })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    <SelectItem value="cover">Cover (fill screen)</SelectItem>
                    <SelectItem value="contain">Contain (fit inside)</SelectItem>
                  </SelectPopup>
                </Select>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="h-8 rounded-md px-3 text-xs text-destructive"
                onClick={() => onUpdate({ src: undefined })}
              >
                Remove Image
              </Button>
            </>
          )}

          {/* Screen color (shown behind / instead of the image) */}
          <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            Screen Color
          </span>
          <ColorPopup
            color={mockup.fill ?? DEFAULT_SCREEN_COLOR}
            onChange={(hex) => onUpdate({ fill: hex })}
            label=""
            className="bg-secondary"
          />

          {/* Safari-only address bar URL */}
          {def?.hasUrl && (
            <>
              <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                Address Bar URL
              </span>
              <Input
                type="text"
                value={mockup.mockupUrl ?? ""}
                placeholder="https://example.com"
                onChange={(event) => onUpdate({ mockupUrl: event.target.value })}
                className={sizeInput}
              />
            </>
          )}

          {/* Rotation */}
          <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            Rotation
          </span>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 shrink-0 rounded-md border border-input bg-secondary flex items-center justify-center">
              <RotateCw className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              type="number"
              value={Math.round(mockup.rotation ?? 0)}
              onChange={(event) => {
                const parsed = Number(event.target.value)
                if (Number.isNaN(parsed)) return
                onUpdate({ rotation: parsed })
              }}
              className={`${sizeInput} flex-1`}
            />
            <span className="text-xs text-muted-foreground shrink-0">deg</span>
          </div>

          {/* Size */}
          <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
            Size
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground shrink-0">W</span>
            <Input
              type="number"
              value={Math.round(mockup.width ?? 0)}
              onChange={(event) => {
                const parsed = Number(event.target.value)
                if (Number.isNaN(parsed)) return
                const width = Math.max(40, parsed)
                const aspect = def?.aspect ?? 1
                onUpdate({ width, height: Math.round(width / aspect) })
              }}
              className={sizeInput}
            />
            <span className="text-xs text-muted-foreground shrink-0">H</span>
            <Input
              type="number"
              value={Math.round(mockup.height ?? 0)}
              onChange={(event) => {
                const parsed = Number(event.target.value)
                if (Number.isNaN(parsed)) return
                const height = Math.max(40, parsed)
                const aspect = def?.aspect ?? 1
                onUpdate({ height, width: Math.round(height * aspect) })
              }}
              className={sizeInput}
            />
          </div>
        </div>
      </AccordionPanel>
    </AccordionItem>
  )
}

export default MockupsPanel
