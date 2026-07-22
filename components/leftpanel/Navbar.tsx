"use client"

import React, { useState, useCallback, useEffect, useRef } from "react"
import {
  Layers,
  UserIcon,
  LogOutIcon,
  Download,
  Save,
  FolderOpen,
  LogInIcon,
  Loader2,
  Check,
  MoreHorizontal,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import { cn } from "@/lib/utils"
import ExportDialog from "@/components/workspace/ExportDialog"
import SaveProjectDialog from "@/components/workspace/SaveProjectDialog"
import SavedProjectsDialog from "@/components/workspace/SavedProjectsDialog"
import AuthDialog from "@/components/workspace/AuthDialog"
import { useLayersPanelStore } from "@/store/layerspanelstore"
import { useCurrentProjectStore } from "@/store/currentprojectstore"
import { updateDbProject, updateLocalProject } from "@/lib/projects"
import { buildPayload } from "@/lib/design-payload"
import { syncProjectImagesInBackground } from "@/lib/project-image-sync"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetPopup,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetPanel,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ProfileDialog } from "./ProfileDialog"

const Navbar = () => {
  const router = useRouter()
  const toggleLayers = useLayersPanelStore((state) => state.toggle)
  const layersOpen = useLayersPanelStore((state) => state.open)
  const { data: session } = authClient.useSession()
  const currentId = useCurrentProjectStore((s) => s.id)
  const currentName = useCurrentProjectStore((s) => s.name)
  const lastSavedAt = useCurrentProjectStore((s) => s.lastSavedAt)
  const markSaved = useCurrentProjectStore((s) => s.markSaved)
  const [profileOpen, setProfileOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [savedOpen, setSavedOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
  }

  const signedIn = !!session?.user

  // Quick-save: if project already named, overwrite it silently with a loading
  // + success flash. If not yet named, fall back to the naming dialog.
  const handleSave = useCallback(async () => {
    if (!currentId || !currentName) {
      setSaveOpen(true)
      return
    }
    if (saveState === "saving") return
    setSaveState("saving")
    try {
      const savedPayload = signedIn ? buildPayload() : null
      const ok = signedIn
        ? await updateDbProject(currentId, currentName, savedPayload ?? undefined)
        : updateLocalProject(currentId, currentName)
      // Project vanished (deleted elsewhere); reopen dialog to re-create it.
      if (!ok) {
        setSaveState("idle")
        setSaveOpen(true)
        return
      }
      markSaved()
      setSaveState("saved")
      if (savedTimer.current) clearTimeout(savedTimer.current)
      savedTimer.current = setTimeout(() => setSaveState("idle"), 1500)
      if (signedIn && savedPayload) {
        setTimeout(() => {
          void syncProjectImagesInBackground(
            currentId,
            currentName,
            savedPayload,
          )
        }, 250)
      }
    } catch {
      setSaveState("idle")
      setSaveOpen(true)
    }
  }, [currentId, currentName, signedIn, saveState, markSaved])

  // Ctrl/Cmd+S saves without leaving the page.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleSave])

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current)
    }
  }, [])

  const user = session?.user
  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const projectTitle = currentName?.trim() || "Untitled"
  const savedLabel =
    saveState === "saving"
      ? "Saving..."
      : saveState === "saved"
        ? "Saved just now"
        : lastSavedAt
          ? `Last saved ${new Date(lastSavedAt).toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "2-digit",
            })}`
          : "Not saved yet"

  const openProfileOrAuth = () => {
    if (user) {
      setProfileOpen(true)
    } else {
      setAuthOpen(true)
    }
    setMobileMenuOpen(false)
  }

  const mobileActionClass =
    "h-11 w-full justify-start gap-3 border-none bg-transparent px-0 text-sm shadow-none hover:bg-transparent"

  return (
    <header className="w-full h-14 shrink-0 px-3 sm:px-4 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-3">
        <img
          src="/logo.png"
          alt="OPENGG"
          className="hidden h-9 w-9 aspect-square rounded-xl object-cover md:block"
        />
        <div className="min-w-0 flex flex-col">
          <span className="truncate text-sm font-semibold leading-5 sm:text-base">
            {projectTitle}
          </span>
          <span className="truncate text-[11px] leading-4 text-sidebar-foreground/60 sm:text-xs">
            {savedLabel}
          </span>
        </div>
      </div>

      <div className="hidden items-center gap-1 md:flex">
        <Group>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 outline-none ring-0 transition-colors duration-300",
              saveState === "saved" &&
                "bg-green-600 text-white hover:bg-green-600 hover:text-white",
            )}
            disabled={saveState === "saving"}
            onClick={handleSave}
          >
            {saveState === "saving" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveState === "saved" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save"}
            </span>
          </Button>

          <Button
            variant="outline"
            className="outline-none ring-0"
            size="sm"
            aria-label="Saved projects"
            onClick={() => setSavedOpen(true)}
          >
            <FolderOpen className="h-3 w-3" />
          </Button>
        </Group>

        <Button
          variant={layersOpen ? "secondary" : "outline"}
          size="sm"
          className="gap-2 border-none outline-none ring-0"
          aria-pressed={layersOpen}
          onClick={toggleLayers}
        >
          <Layers className="h-4 w-4" />
          Layers
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full outline-none ring-offset-2 ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-ring transition">
              <Avatar className="size-7 cursor-pointer ring-2 ring-border">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{user.name}</span>
                <span className="text-xs font-normal text-muted-foreground truncate">
                  {user.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                <LogOutIcon />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {!user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full outline-none ring-offset-2 ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-ring transition">
              <Avatar className="size-9 cursor-pointer ring-2 ring-border">
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">Guest</span>
                <span className="text-xs font-normal text-muted-foreground">
                  Unauthenticated
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setAuthOpen(true)}>
                <LogInIcon />
                Sign in
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="shrink-0 border-none outline-none ring-0 md:hidden"
        aria-label="Open navigation menu"
        onClick={() => setMobileMenuOpen(true)}
      >
        <MoreHorizontal className="h-5 w-5" />
      </Button>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetPopup side="bottom" className="max-h-[85vh] rounded-t-2xl">
          <SheetHeader className="pb-3">
            <SheetTitle className="pr-10 text-lg">{projectTitle}</SheetTitle>
            <SheetDescription>{savedLabel}</SheetDescription>
          </SheetHeader>

          <SheetPanel className="flex flex-col gap-5 pb-6 pt-1">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
              <Avatar className="size-10 ring-2 ring-border">
                {user?.image && <AvatarImage src={user.image} alt={user.name ?? ""} />}
                <AvatarFallback>{user ? initials : "G"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user?.name || "Guest"}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email || "Unauthenticated"}
                </p>
              </div>
              <Button size="sm" variant="secondary" onClick={openProfileOrAuth}>
                {user ? "Profile" : "Sign in"}
              </Button>
            </div>

            <div className="flex flex-col">
              <Button
                variant="ghost"
                className={cn(
                  mobileActionClass,
                  saveState === "saved" && "text-green-600 hover:text-green-600",
                )}
                disabled={saveState === "saving"}
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleSave()
                }}
              >
                {saveState === "saving" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saveState === "saved" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved" : "Save"}
              </Button>
              <Button
                variant="ghost"
                className={mobileActionClass}
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSavedOpen(true)
                }}
              >
                <FolderOpen className="h-4 w-4" />
                Open projects
              </Button>
              <Button
                variant="ghost"
                className={mobileActionClass}
                onClick={() => {
                  setMobileMenuOpen(false)
                  setExportOpen(true)
                }}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="ghost"
                className={mobileActionClass}
                aria-pressed={layersOpen}
                onClick={() => {
                  setMobileMenuOpen(false)
                  toggleLayers()
                }}
              >
                <Layers className="h-4 w-4" />
                Layers
              </Button>
            </div>

            {user && (
              <>
                <Separator />
                <Button
                  variant="ghost"
                  className={cn(mobileActionClass, "text-destructive hover:text-destructive")}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleSignOut()
                  }}
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
          </SheetPanel>
        </SheetPopup>
      </Sheet>

      {user && (
        <ProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          user={user}
        />
      )}

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} />

      <SaveProjectDialog
        open={saveOpen}
        onOpenChange={setSaveOpen}
        signedIn={!!user}
        onSaved={() => markSaved()}
      />

      <SavedProjectsDialog
        open={savedOpen}
        onOpenChange={setSavedOpen}
        signedIn={!!user}
      />

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}

export default Navbar
