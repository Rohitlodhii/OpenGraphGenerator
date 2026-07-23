"use client"

import React from "react"
import { LayoutTemplate, Loader2, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
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

const TemplateList = () => {
  const [templates, setTemplates] = React.useState<TemplateSummary[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const canSaveTemplates = process.env.NEXT_PUBLIC_ENVIRONMENT === "dev"

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
    refresh()
  }, [refresh])

  const handleSave = async () => {
    const suggestion = `Template ${new Date().toISOString().slice(0, 16).replace("T", " ")}`
    const name = window.prompt("Save template as", suggestion)
    if (!name || !name.trim()) return
    setSaving(true)
    try {
      await saveTemplate(name.trim())
      await refresh()
    } catch {
      window.alert("Failed to save template.")
    } finally {
      setSaving(false)
    }
  }

  const handleLoad = async (id: string) => {
    await loadTemplate(id)
  }

  const handleDelete = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation()
    const ok = await deleteTemplate(id)
    if (ok) setTemplates((prev) => prev.filter((template) => template.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      {canSaveTemplates && (
        <Button
          onClick={handleSave}
          disabled={saving}
          variant="secondary"
          className="h-10 justify-start text-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save as Template
        </Button>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-10 text-sm text-muted-foreground">
          {error}
          <Button variant="secondary" size="sm" onClick={refresh}>
            Retry
          </Button>
        </div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-10 text-center">
          <LayoutTemplate className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm font-medium">No templates yet</p>
          <p className="text-xs text-muted-foreground">
            Use “Save as Template” to create your first one.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleLoad(template.id)}
              className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-2 text-left transition-colors hover:border-primary"
            >
              <div className="relative aspect-[1200/630] h-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={template.thumbnailUrl}
                  alt={template.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{template.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(template.createdAt)}
                </span>
              </div>
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
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-destructive opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplateList
