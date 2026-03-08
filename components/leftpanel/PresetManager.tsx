"use client"

import React from "react"
import { FolderOpen, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  listGenerationPresets,
  loadGenerationPreset,
  saveGenerationPreset,
} from "@/lib/generation-preset"

const PresetManager = () => {
  const [presetNames, setPresetNames] = React.useState<string[]>([])
  const [selectedPreset, setSelectedPreset] = React.useState("")

  const refreshPresets = React.useCallback(() => {
    const presets = listGenerationPresets()
    setPresetNames(presets.map((preset) => preset.name))
  }, [])

  React.useEffect(() => {
    refreshPresets()
  }, [refreshPresets])

  const handleSavePreset = () => {
    const suggestion = `Preset ${new Date().toISOString().slice(0, 16).replace("T", " ")}`
    const name = window.prompt("Save preset as", suggestion)
    if (!name || !name.trim()) return
    const finalName = name.trim()
    saveGenerationPreset(finalName)
    refreshPresets()
    setSelectedPreset(finalName)
  }

  const handleLoadPreset = () => {
    if (!selectedPreset) return
    const loaded = loadGenerationPreset(selectedPreset)
    if (!loaded) {
      refreshPresets()
    }
  }

  return (
    <div className="w-full rounded-2xl border border-border p-3 flex flex-col gap-2">
      <div className="text-xs font-medium text-muted-foreground">Project Presets</div>
      <Button onClick={handleSavePreset} variant="secondary" size="sm" className="justify-start text-xs">
        <Save className="h-4 w-4" />
        Save Current
      </Button>
      <select
        value={selectedPreset}
        onChange={(event) => setSelectedPreset(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none"
        aria-label="Choose saved preset"
      >
        <option value="">Choose preset</option>
        {presetNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <Button
        onClick={handleLoadPreset}
        disabled={!selectedPreset}
        variant="secondary"
        size="sm"
        className="justify-start text-xs"
      >
        <FolderOpen className="h-4 w-4" />
        Load Selected
      </Button>
    </div>
  )
}

export default PresetManager
