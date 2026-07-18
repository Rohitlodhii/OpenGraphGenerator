"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

type NavbarProps = {
  showSidebarToggle?: boolean
}

const Navbar = ({ showSidebarToggle = false }: NavbarProps) => {
  return (
    <header className="w-full h-14 shrink-0 px-4 border-b border-border bg-sidebar text-sidebar-foreground flex items-center justify-between">
      <div className="flex gap-2 items-center">
        <div className="h-9 w-9 aspect-square rounded-xl bg-amber-700" />
        <div className="font-mono text-base tracking-wide">OPENGG</div>
      </div>

      {showSidebarToggle ? (
        <SidebarTrigger aria-label="Toggle left sidebar" />
      ) : null}
    </header>
  )
}

export default Navbar
