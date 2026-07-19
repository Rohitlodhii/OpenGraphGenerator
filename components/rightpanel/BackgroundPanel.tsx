import React, { useState } from 'react'
import { LayoutGrid, Trash2 } from 'lucide-react'
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { NewBackground } from './NewBackground'
import { SolidColorPanel } from './SolidColorPanel'
import { ImagePanel } from './ImagePanel'
import { useBackgroundStore } from '@/store/backgroundstore'
import { useGradientStore } from '@/store/gradientstore'
import { libraryGradients } from '@/data/gradients'
import RawGradientSvg from '../previewers/RawGradientSvg'
import SvgGradientPanel from './SvgGradientPanel'
import GradientLibraryDialog from './GradientLibraryDialog'



const items = [
  { label: "Solid Color", value: 'solid' },
  { label: "Upload Image", value: 'image' },
  { label: "Mesh Gradients", value: 'mesh' },
  { label : "SVG Gradients" , value : 'Svg Gradient'},
  { label: "Presets", value: 'presets' },
]

type SupportedBackgroundType = 'solid' | 'mesh' | 'image' | 'Svg Gradient'

type BackgroundPanelProps = {
  isOpen?: boolean
  onToggle?: () => void
  chromeless?: boolean
}

const BackgroundPanel = ({ isOpen, onToggle, chromeless = false }: BackgroundPanelProps) => {
  const { setBackgroundType } = useBackgroundStore()
  const backgroundType = useBackgroundStore((s) => s.backgroundType)
  const appliedGradientId = useGradientStore((s) => s.appliedGradientId)
  const setAppliedGradient = useGradientStore((s) => s.setAppliedGradient)
  const [selected, setSelected] = useState<string>('solid');
  const [libraryOpen, setLibraryOpen] = useState(false)

  // A library gradient is "active" when it's applied AND the background is
  // actually showing it. While active, the whole panel collapses to just the
  // selected-gradient card so the solid/image/etc. options stay out of the way.
  const activeGradient =
    backgroundType === 'gradient'
      ? libraryGradients.find((g) => g.id === appliedGradientId) ?? null
      : null

  const handleSelectionChange = (value: string) => {
    setSelected(value)
    if (value === 'solid' || value === 'mesh' || value === 'image' || value === 'Svg Gradient') {
      setBackgroundType(value as SupportedBackgroundType)
    }
  }

  // Clear the applied library gradient and fall back to the current dropdown
  // selection (solid unless the user had picked another editable type).
  const clearGradient = () => {
    setAppliedGradient(null)
    const fallback =
      selected === 'solid' || selected === 'mesh' || selected === 'image' || selected === 'Svg Gradient'
        ? (selected as SupportedBackgroundType)
        : 'solid'
    setBackgroundType(fallback)
  }

  // Shown in place of the whole panel while a library gradient is applied.
  const selectedGradientCard = activeGradient && (
    <div className="flex w-full flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">Selected background</span>
      <div className="flex items-center gap-3 rounded-md border border-primary bg-secondary p-2 ring-1 ring-primary">
        <span className="h-10 w-16 shrink-0 overflow-hidden rounded-md border border-border">
          <RawGradientSvg svg={activeGradient.svg} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-xs font-medium">{activeGradient.name}</span>
          <span className="text-[11px] text-muted-foreground">Non-editable background</span>
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 shrink-0 p-0 text-destructive hover:text-destructive"
          onClick={clearGradient}
          title="Remove background"
          aria-label="Remove background"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="w-full gap-1.5"
        onClick={() => setLibraryOpen(true)}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        Change background
      </Button>
    </div>
  )

  // "Non-editable bgs" — a single row button (matching the Shapes tab) that
  // opens the full library dialog. No previews are shown inline; every
  // gradient is browsed inside the dialog itself.
  const gradientSection = (
    <div className="flex w-full flex-col gap-2 pt-1">
      <span className="text-xs font-medium text-muted-foreground">Non-editable bgs</span>
      <button
        type="button"
        onClick={() => setLibraryOpen(true)}
        className="flex h-11 w-full items-center gap-3 rounded-md border border-border bg-secondary px-2 text-left transition hover:border-primary/50"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-background/60 p-0.5">
          {libraryGradients[0] ? (
            <RawGradientSvg svg={libraryGradients[0].svg} />
          ) : (
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
        <span className="flex flex-col">
          <span className="text-xs font-medium">Gradient Backgrounds</span>
          <span className="text-[11px] text-muted-foreground">
            Curated gradient & SVG backdrops
          </span>
        </span>
      </button>
    </div>
  )

  const typeSelect = (
    <Select
      defaultValue={'solid'}
      onValueChange={(v) => handleSelectionChange(v as string)}
    >
      <SelectTrigger
        size={"sm"}
        className={chromeless
          ? "w-full border-none shadow-none ring-1 ring-primary/10 h-10 text-sm"
          : "w-[50%] border-none shadow-none ring-1 ring-primary/10 h-6"}
        onClick={(e) => e.stopPropagation()}
      >
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
  )

  const body = activeGradient ? (
    selectedGradientCard
  ) : (
    <>
      {selected === 'solid' && <SolidColorPanel />}
      {selected === 'image' && <ImagePanel />}
      {selected === 'mesh' && <NewBackground />}
      {selected === 'Svg Gradient' && <SvgGradientPanel />}
      {gradientSection}
    </>
  )

  if (chromeless) {
    return (
      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">Background</span>
        {!activeGradient && typeSelect}
        <div className="flex flex-col">{body}</div>
        <GradientLibraryDialog open={libraryOpen} onOpenChange={setLibraryOpen} />
      </div>
    )
  }

  return (
    <div className='border border-border flex flex-col rounded-xl items-center overflow-hidden'>
        <div
          className='flex gap-2 items-center justify-between w-full bg-sidebar h-14 px-4 border-b border-border cursor-pointer select-none'
          onClick={onToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onToggle?.()
            }
          }}
        >
          <span className='text-sm font-medium'>Background</span>
         {!activeGradient && typeSelect}
        </div>

        <div className={`w-full px-4 transition-all duration-200 ${isOpen ? 'py-2' : 'max-h-0 py-0 overflow-hidden'}`}>
          {body}
        </div>

        <GradientLibraryDialog open={libraryOpen} onOpenChange={setLibraryOpen} />
    </div>
  )
}

export default BackgroundPanel
