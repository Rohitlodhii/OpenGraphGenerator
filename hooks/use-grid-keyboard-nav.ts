import * as React from "react"

type Options = {
  // Only handle keys while the dialog is open.
  enabled: boolean
  // Ordered ids of the grid items, in DOM order.
  ids: string[]
  selectedId: string | null
  setSelectedId: (id: string) => void
  // Called when Enter is pressed with a valid selection.
  onEnter: () => void
  // Container wrapping the grid items (each tagged with data-grid-item).
  containerRef: React.RefObject<HTMLElement | null>
}

const ARROWS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]

// Keyboard navigation for a responsive grid of selectable cards:
// - Arrow keys move the selection (column count is measured from the DOM so it
//   stays correct across breakpoints).
// - Enter applies the current selection.
// Esc is handled by the dialog primitive itself.
export function useGridKeyboardNav({
  enabled,
  ids,
  selectedId,
  setSelectedId,
  onEnter,
  containerRef,
}: Options) {
  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!enabled || ids.length === 0) return

      if (event.key === "Enter") {
        if (selectedId) {
          // Prevent a focused card's native Enter-activation from also firing.
          event.preventDefault()
          onEnter()
        }
        return
      }

      if (!ARROWS.includes(event.key)) return
      event.preventDefault()

      const currentIndex = selectedId ? ids.indexOf(selectedId) : -1
      if (currentIndex === -1) {
        setSelectedId(ids[0])
        return
      }

      // Measure how many items sit in the first row to get the column count.
      let cols = 1
      const container = containerRef.current
      if (container) {
        const items = Array.from(
          container.querySelectorAll<HTMLElement>("[data-grid-item]"),
        )
        if (items.length > 0) {
          const firstTop = items[0].offsetTop
          cols = items.filter((it) => it.offsetTop === firstTop).length || 1
        }
      }

      let next = currentIndex
      switch (event.key) {
        case "ArrowLeft":
          next = Math.max(0, currentIndex - 1)
          break
        case "ArrowRight":
          next = Math.min(ids.length - 1, currentIndex + 1)
          break
        case "ArrowUp":
          next = currentIndex - cols >= 0 ? currentIndex - cols : currentIndex
          break
        case "ArrowDown":
          next =
            currentIndex + cols <= ids.length - 1
              ? currentIndex + cols
              : currentIndex
          break
      }

      if (next !== currentIndex) setSelectedId(ids[next])
    },
    [enabled, ids, selectedId, setSelectedId, onEnter, containerRef],
  )

  return onKeyDown
}
