"use client"

import { useEffect } from "react"
import { undo, redo } from "@/hooks/use-history"

// Skip shortcuts while typing in inputs/textareas/contenteditable so we don't
// hijack the browser's native text undo.
const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  )
}

export const useHistoryShortcuts = () => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.ctrlKey || event.metaKey
      if (!mod) return
      if (isEditableTarget(event.target)) return

      const key = event.key.toLowerCase()

      if (key === "z" && !event.shiftKey) {
        event.preventDefault()
        undo()
        return
      }
      // Ctrl+Y or Ctrl+Shift+Z for redo.
      if (key === "y" || (key === "z" && event.shiftKey)) {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])
}
