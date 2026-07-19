"use client"

import React, { useState } from "react"
import { Layers, Undo2, Redo2, UserIcon, LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLayersPanelStore } from "@/store/layerspanelstore"
import { useHistoryStore } from "@/store/historystore"
import { undo, redo } from "@/hooks/use-history"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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
  const canUndo = useHistoryStore((state) => state.past.length > 0)
  const canRedo = useHistoryStore((state) => state.future.length > 0)
  const { data: session } = authClient.useSession()
  const [profileOpen, setProfileOpen] = useState(false)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
  }

  const user = session?.user
  const initials = (user?.name || user?.email || "?")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="w-full h-14 shrink-0 px-4 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="h-9 w-9 aspect-square rounded-xl bg-amber-700" />
        <div className="font-mono text-base tracking-wide">OPENGG</div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={undo}
          disabled={!canUndo}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={redo}
          disabled={!canRedo}
          aria-label="Redo"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button
          variant={layersOpen ? "secondary" : "outline"}
          size="sm"
          className="gap-2"
          aria-pressed={layersOpen}
          onClick={toggleLayers}
        >
          <Layers className="h-4 w-4" />
          Layers
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 rounded-full outline-none ring-offset-2 ring-offset-sidebar focus-visible:ring-2 focus-visible:ring-ring transition">
              <Avatar className="size-9 cursor-pointer ring-2 ring-border">
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
      </div>

      {user && (
        <ProfileDialog
          open={profileOpen}
          onOpenChange={setProfileOpen}
          user={user}
        />
      )}
    </header>
  )
}

export default Navbar
