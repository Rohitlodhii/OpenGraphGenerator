"use client"

import React from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogPortal, DialogBackdrop } from "@/components/ui/dialog"
import { Sheet, SheetPopup } from "@/components/ui/sheet"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import ColorPopup from "@/components/helpers/colorpopup"
import SliderWithInput from "@/components/helpers/SliderWithInput"
import { AsciiArt } from "@/components/ui/ascii-art"

export type AsciiConfig = {
  src: string
  resolution: number
  charset: string
  color: string
  backgroundColor: string
  inverted: boolean
  colored: boolean
  animationStyle: "fade" | "typewriter" | "matrix" | "none"
  objectFit: "cover" | "contain" | "fill"
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUse: (config: AsciiConfig) => void
}

const CHARSETS = [
  "standard",
  "blocks",
  "binary",
  "dots",
  "minimal",
  "dense",
  "arrows",
  "stars",
  "hash",
  "pipes",
  "braille",
  "circles",
  "squares",
  "hearts",
  "math",
]

const OBJECT_FITS: { value: AsciiConfig["objectFit"]; label: string }[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "fill", label: "Fill" },
]

const AsciiGeneratorDialog: React.FC<Props> = ({ open, onOpenChange, onUse }) => {
  const isMobile = useIsMobile()
  const [src, setSrc] = React.useState<string | null>(null)
  const [resolution, setResolution] = React.useState(100)
  const [charset, setCharset] = React.useState("standard")
  const [color, setColor] = React.useState("#ffffff")
  const [backgroundColor, setBackgroundColor] = React.useState("#0a0a0a")
  const [inverted, setInverted] = React.useState(false)
  const [colored, setColored] = React.useState(false)
  const [noBackground, setNoBackground] = React.useState(false)
  const [objectFit, setObjectFit] = React.useState<AsciiConfig["objectFit"]>("cover")

  // Reset transient state whenever the dialog re-opens. The object URL from a
  // previous session is released so we don't leak it.
  React.useEffect(() => {
    if (!open) return
    setSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    setResolution(100)
    setCharset("standard")
    setColor("#ffffff")
    setBackgroundColor("#0a0a0a")
    setInverted(false)
    setColored(false)
    setNoBackground(false)
    setObjectFit("cover")
  }, [open])

  // "transparent" is a value AsciiArt understands and skips filling the canvas.
  const effectiveBackground = noBackground ? "transparent" : backgroundColor

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
    event.target.value = ""
  }

  const handleUse = () => {
    if (!src) return
    onUse({
      src,
      resolution,
      charset,
      color,
      backgroundColor: effectiveBackground,
      inverted,
      colored,
      animationStyle: "none",
      objectFit,
    })
    onOpenChange(false)
  }

  const header = (
    <div className="flex flex-col gap-1 border-b border-border bg-sidebar px-6 py-4">
      <h2 className="font-heading font-semibold text-xl leading-none">ASCII Generator</h2>
      <p className="text-muted-foreground text-sm">
        Upload an image, tweak the look, and drop the ASCII art on your canvas.
      </p>
    </div>
  )

  const preview = (
    <div className="flex min-h-64 flex-1 items-center justify-center rounded-xl border border-border bg-muted/30 p-3">
      {src ? (
        <AsciiArt
          key={`${src}-${resolution}-${charset}-${color}-${effectiveBackground}-${inverted}-${colored}-${objectFit}`}
          src={src}
          resolution={resolution}
          charset={charset}
          color={color}
          backgroundColor={effectiveBackground}
          inverted={inverted}
          colored={colored}
          animationStyle="none"
          animated={false}
          animateOnView={false}
          objectFit={objectFit}
          className="aspect-square w-full max-w-sm"
        />
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-border px-8 py-12 text-center text-muted-foreground transition hover:bg-muted/50">
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <Upload className="h-6 w-6" />
          <span className="text-sm">Click to upload an image</span>
        </label>
      )}
    </div>
  )

  const controls = (
    <div className="flex w-full flex-col gap-4 lg:w-72">
      <SliderWithInput
        key={`ascii-resolution-${open}`}
        defaultValue={[resolution]}
        initialValue={[resolution]}
        label="Resolution"
        minValue={20}
        maxValue={240}
        step={5}
        onChange={(vals) => setResolution(vals[0])}
      />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Charset</span>
        <Select value={charset} onValueChange={(value) => setCharset(value ?? "standard")}>
          <SelectTrigger className="h-8 text-xs" size="default">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHARSETS.map((c) => (
              <SelectItem key={c} value={c} className="text-xs capitalize">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground">Image Fit</span>
        <Select
          value={objectFit}
          onValueChange={(value) => setObjectFit(value as AsciiConfig["objectFit"])}
        >
          <SelectTrigger className="h-8 text-xs" size="default">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OBJECT_FITS.map((f) => (
              <SelectItem key={f.value} value={f.value} className="text-xs">
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">Text Color</span>
        <ColorPopup color={color} onChange={setColor} label="" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">Background</span>
          <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            No background
            <Switch checked={noBackground} onCheckedChange={setNoBackground} />
          </label>
        </div>
        {!noBackground && (
          <ColorPopup color={backgroundColor} onChange={setBackgroundColor} label="" />
        )}
      </div>

      <label className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        Colored (use image colors)
        <Switch checked={colored} onCheckedChange={setColored} />
      </label>

      <label className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
        Inverted
        <Switch checked={inverted} onCheckedChange={setInverted} />
      </label>
    </div>
  )

  const body = (
    <div className="min-h-0 flex-1">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-4 p-6 lg:flex-row">
          {preview}
          {controls}
        </div>
      </ScrollArea>
    </div>
  )

  const footer = (
    <div className="flex items-center justify-end gap-4 border-t border-border bg-sidebar px-6 py-3">
      <Button size="sm" onClick={handleUse} disabled={!src}>
        Add to Canvas
      </Button>
    </div>
  )

  const content = (
    <div className="flex h-full min-h-0 flex-col outline-none" tabIndex={-1}>
      {header}
      {body}
      {footer}
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetPopup side="bottom" className="h-[90vh] p-0">
          {content}
        </SheetPopup>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 grid place-items-center p-4">
          <DialogPrimitive.Popup
            className={cn(
              "relative flex h-[85vh] max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg transition-[scale,opacity] duration-200 data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0",
            )}
          >
            {content}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPortal>
    </Dialog>
  )
}

export default AsciiGeneratorDialog
