"use client"

import React from "react"
import { LayoutTemplate, Loader2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
} from "@/components/ui/dialog"
import {
  deleteTemplate,
  listTemplates,
  loadTemplate,
  saveTemplate,
  type TemplateSummary,
} from "@/lib/templates"

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

const TemplateBrowser = () => {
  const [open, setOpen] = React.useState(false)
  const [templates, setTemplates] = React.useState<TemplateSummary[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  const refresh = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTemplates(await listTemplates())
    } catch {
      setError("Could not load templates.")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (open) refresh()
  }, [open, refresh])

  const handleSave = async () => {
    const suggestion = `Template ${new Date().toISOString().slice(0, 16).replace("T", " ")}`
    const name = window.prompt("Save template as", suggestion)
    if (!name || !name.trim()) return
    setSaving(true)
    try {
      await saveTemplate(name.trim())
      if (open) await refresh()
    } catch {
      window.alert("Failed to save template.")
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = async (id: string) => {
    const ok = await loadTemplate(id)
    if (ok) setOpen(false)
  }

  const handleDelete = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation()
    const ok = await deleteTemplate(id)
    if (ok) setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  return (
    <div className="w-full rounded-2xl border border-border p-3 flex flex-col gap-2">
      <div className="text-xs font-medium text-muted-foreground">Templates</div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-center transition-colors hover:border-primary/50 hover:bg-secondary"
      >
        <LayoutTemplate className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
        <span className="text-sm font-medium">Browse Templates</span>
        <span className="text-xs text-muted-foreground">
          Pick a ready-made design to start from
        </span>
      </button>

      {/* Temporary: lets you create templates from the current design. */}
      <Button
        onClick={handleSave}
        disabled={saving}
        variant="secondary"
        size="sm"
        className="justify-start text-xs"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save as Template
      </Button>

      <Dialog open={open} onOpenChange={(nextOpen) => setOpen(nextOpen)}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Templates</DialogTitle>
            <DialogDescription>
              Choose a template to load it into the editor.
            </DialogDescription>
          </DialogHeader>

          <DialogPanel>
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading templates…
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
                {error}
                <Button variant="secondary" size="sm" onClick={refresh}>
                  Retry
                </Button>
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-col items-center gap-1 py-16 text-center">
                <LayoutTemplate className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No templates yet</p>
                <p className="text-xs text-muted-foreground">
                  Use “Save as Template” to create your first one.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => handleLoad(template.id)}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-primary"
                  >
                    <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Delete template"
                        onClick={(event) => handleDelete(event, template.id)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            handleDelete(event as unknown as React.MouseEvent, template.id)
                          }
                        }}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-background/80 text-destructive opacity-0 shadow-sm backdrop-blur-sm transition-opacity hover:bg-background group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 p-2">
                      <span className="truncate text-sm font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(template.createdAt)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </DialogPanel>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TemplateBrowser
