"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Trash2, RefreshCw, Plus } from "lucide-react"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Folder } from "@/components/ui/folder-components"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useCurrentProjectStore } from "@/store/currentprojectstore"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  signedIn: boolean
}

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

const SavedProjectsDialog: React.FC<Props> = ({ open, onOpenChange, signedIn }) => {
  const router = useRouter()
  const [projects, setProjects] = React.useState<ProjectSummary[]>([])
  const [loading, setLoading] = React.useState(false)
  const [syncing, setSyncing] = React.useState(false)
  const [showSync, setShowSync] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

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
    if (open) refresh()
  }, [open, refresh])

  const handleLoad = (id: string) => {
    onOpenChange(false)
    router.push(`/dashboard/${id}`)
  }

  const handleNew = () => {
    newProject()
    useCurrentProjectStore.getState().clear()
    onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Saved projects</DialogTitle>
          <DialogDescription>
            {signedIn
              ? "Projects saved to your account."
              : "Projects saved to this browser. Sign in to sync them."}
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-4">
          {showSync && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/40 p-3">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="size-32 rounded-[32px]" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto py-2">
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
        </DialogPanel>
      </DialogPopup>

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
    </Dialog>
  )
}

export default SavedProjectsDialog
