"use client"

import React from "react"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  saveDbProject,
  saveLocalProject,
  updateDbProject,
  updateLocalProject,
} from "@/lib/projects"
import { useCurrentProjectStore } from "@/store/currentprojectstore"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  signedIn: boolean
  onSaved?: () => void
}

const SaveProjectDialog: React.FC<Props> = ({ open, onOpenChange, signedIn, onSaved }) => {
  const router = useRouter()
  const currentId = useCurrentProjectStore((s) => s.id)
  const currentName = useCurrentProjectStore((s) => s.name)
  const setCurrent = useCurrentProjectStore((s) => s.setCurrent)
  const [name, setName] = React.useState("")
  const [saveAsNew, setSaveAsNew] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const updating = !!currentId && !saveAsNew

  React.useEffect(() => {
    if (open) {
      setName(currentName ?? "")
      setSaveAsNew(false)
      setError(null)
    }
  }, [open, currentName])

  const handleSave = async () => {
    const trimmed = name.trim()
    if (!trimmed || saving) return
    setSaving(true)
    setError(null)
    try {
      if (updating) {
        const ok = signedIn
          ? await updateDbProject(currentId, trimmed)
          : updateLocalProject(currentId, trimmed)
        if (!ok) throw new Error("missing")
        setCurrent(currentId, trimmed)
      } else {
        const id = signedIn ? await saveDbProject(trimmed) : saveLocalProject(trimmed).id
        setCurrent(id, trimmed)
        router.push(`/dashboard/${id}`)
      }
      onSaved?.()
      onOpenChange(false)
    } catch {
      setError("Could not save project. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>{updating ? "Save changes" : "Save project"}</DialogTitle>
          <DialogDescription>
            {updating
              ? "Update this project with your latest changes."
              : signedIn
                ? "Save this project to your account."
                : "Save this project to this browser. Sign in to sync it to your account."}
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            value={name}
            autoFocus
            placeholder="My design"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
            }}
          />
          {currentId && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <input
                type="checkbox"
                checked={saveAsNew}
                onChange={(e) => setSaveAsNew(e.target.checked)}
                className="size-4 accent-accent"
              />
              Save as a new copy
            </label>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </DialogPanel>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || saving}>
            {saving ? "Saving..." : updating ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export default SaveProjectDialog
