"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Trash2, RefreshCw, Plus } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Folder } from "@/components/ui/folder-components"
import { Skeleton } from "@/components/ui/skeleton"
import AuthDialog from "@/components/workspace/AuthDialog"
import ConfirmDialog from "@/components/workspace/ConfirmDialog"
import {
  type ProjectSummary,
  listLocalProjects,
  listDbProjects,
  deleteLocalProject,
  deleteDbProject,
  hasLocalProjects,
  syncLocalToDb,
  newProject,
} from "@/lib/projects"
import { listTemplates, type TemplateSummary } from "@/lib/templates"
import { useCurrentProjectStore } from "@/store/currentprojectstore"

const fmtDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DashboardHome() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const signedIn = !!session?.user
  const user = session?.user

  const [mounted, setMounted] = React.useState(false)
  const [projects, setProjects] = React.useState<ProjectSummary[]>([])
  const [templates, setTemplates] = React.useState<TemplateSummary[]>([])
  const [loading, setLoading] = React.useState(false)
  const [templatesLoading, setTemplatesLoading] = React.useState(false)
  const [syncing, setSyncing] = React.useState(false)
  const [showSync, setShowSync] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [templatesError, setTemplatesError] = React.useState<string | null>(null)
  const [authOpen, setAuthOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  React.useEffect(() => setMounted(true), [])

  const refresh = React.useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = signedIn ? await listDbProjects() : listLocalProjects()
      setProjects(list)
      setShowSync(signedIn && hasLocalProjects())
    } catch {
      setError("Could not load projects.")
    } finally {
      setLoading(false)
    }
  }, [signedIn])

  React.useEffect(() => {
    if (mounted && !isPending) refresh()
  }, [mounted, isPending, refresh])

  const handleLoad = (id: string) => router.push(`/dashboard/${id}`)
  const handleLoadTemplate = (id: string) => {
    useCurrentProjectStore.getState().clear()
    router.push(`/dashboard/new?template=${encodeURIComponent(id)}`)
  }

  const refreshTemplates = React.useCallback(async () => {
    setTemplatesLoading(true)
    setTemplatesError(null)
    try {
      setTemplates(await listTemplates())
    } catch {
      setTemplatesError("Could not load templates.")
    } finally {
      setTemplatesLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (mounted) refreshTemplates()
  }, [mounted, refreshTemplates])

  const handleNew = () => {
    newProject()
    useCurrentProjectStore.getState().clear()
    router.push("/dashboard/new")
  }

  const handleDelete = async (id: string) => {
    if (signedIn) {
      await deleteDbProject(id)
    } else {
      deleteLocalProject(id)
    }
    refresh()
  }

  const deleteTarget = projects.find((p) => p.id === deleteId)

  const handleSync = async () => {
    setSyncing(true)
    setError(null)
    try {
      await syncLocalToDb()
      await refresh()
    } catch {
      setError("Sync failed. Try again.")
    } finally {
      setSyncing(false)
    }
  }

  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <header className="w-full h-14 shrink-0 px-4 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img src="/logo.png" alt="OPENGG" className="h-9 w-9 aspect-square rounded-xl object-cover" />
        </div>

        {mounted && signedIn && user ? (
          <Avatar className="size-9 ring-2 ring-border">
            {user.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="size-9 ring-2 ring-border">
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Guest</span>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setAuthOpen(true)}>
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </div>
        )}
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-2xl tracking-tight font-semibold">Saved projects</h1>
          <p className="text-sm text-muted-foreground">
            {signedIn
              ? "Projects saved to your account."
              : "Projects saved to this browser. Sign in to sync them."}
          </p>
        </div>

        {showSync && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 ">
            <p className="text-sm text-muted-foreground">
              You have projects saved in this browser. Sync them to your account.
            </p>
            <Button size="sm" onClick={handleSync} disabled={syncing} className="gap-2 shrink-0">
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing..." : "Sync to account"}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 py-2 justify-items-start">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="size-32 rounded-[32px]" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 py-2 justify-items-start">
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleNew}
                aria-label="New project"
                className="size-32 rounded-[32px] flex items-center justify-center border-2 border-dashed border-border text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors"
              >
                <Plus className="h-10 w-10" />
              </button>
              <span className="text-sm font-medium text-center">New project</span>
            </div>

            {projects.map((p) => (
              <div key={p.id} className="group relative flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoad(p.id)}
                  className="flex flex-col items-center gap-2 outline-none"
                  aria-label={`Open ${p.name}`}
                >
                  <Folder size="md" color="theme" />
                  <span className="text-sm font-medium text-center line-clamp-1 max-w-full">
                    {p.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{fmtDate(p.createdAt)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(p.id)}
                  aria-label={`Delete ${p.name}`}
                  className="absolute top-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-sm text-muted-foreground -mt-2">
            No projects yet. Hit New project to start one.
          </p>
        )}

        <section className="flex flex-col gap-4 pt-4">
          <div>
            <h2 className="font-heading text-2xl tracking-tight font-semibold">
              Templates to start
            </h2>
            <p className="text-sm text-muted-foreground">
              Pick a template and customize it in the editor.
            </p>
          </div>

          {templatesError && <p className="text-sm text-destructive">{templatesError}</p>}

          {templatesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[1200/630] rounded-lg" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No templates available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleLoadTemplate(template.id)}
                  className="group overflow-hidden rounded-lg border border-border bg-card text-left transition hover:border-primary"
                  aria-label={`Start with ${template.name}`}
                >
                  <div className="aspect-[1200/630] w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-3">
                    <span className="truncate text-sm font-medium">{template.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {template.dimensions.width} x {template.dimensions.height}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete project?"
        description={
          deleteTarget
            ? `"${deleteTarget.name}" will be permanently deleted. This cannot be undone.`
            : "This project will be permanently deleted. This cannot be undone."
        }
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId)
          setDeleteId(null)
        }}
      />
    </div>
  )
}
