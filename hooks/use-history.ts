"use client"

import { useEffect } from "react"
import { applyPayload, buildPayload } from "@/lib/design-payload"
import { useHistoryStore } from "@/store/historystore"
import { useBackgroundStore } from "@/store/backgroundstore"
import { useSolidColorStore } from "@/store/solidcolorstore"
import { useMeshStore } from "@/store/meshstore"
import { useImageStore } from "@/store/imagestore"
import useSvgGradientStore from "@/store/svggradientstore"
import { useGradientStore } from "@/store/gradientstore"
import { useCanvasStore } from "@/store/canvasstore"
import useDimensionStore from "@/hooks/dimension"

const DEBOUNCE_MS = 400

// Every design store that contributes to a payload snapshot. Subscribing to
// each lets us capture history no matter which panel drives the edit.
const stores = [
  useBackgroundStore,
  useSolidColorStore,
  useMeshStore,
  useImageStore,
  useSvgGradientStore,
  useGradientStore,
  useCanvasStore,
  useDimensionStore,
]

export const useHistoryManager = () => {
  useEffect(() => {
    // Seed the initial present state.
    useHistoryStore.getState().record(buildPayload())

    let timer: ReturnType<typeof setTimeout> | null = null

    const scheduleRecord = () => {
      if (useHistoryStore.getState().isApplying) return
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        useHistoryStore.getState().record(buildPayload())
      }, DEBOUNCE_MS)
    }

    const unsubscribers = stores.map((store) => store.subscribe(scheduleRecord))

    return () => {
      if (timer) clearTimeout(timer)
      unsubscribers.forEach((unsub) => unsub())
    }
  }, [])
}

export const undo = () => {
  const history = useHistoryStore.getState()
  const payload = history.undo()
  if (!payload) return
  history.setApplying(true)
  applyPayload(payload)
  // Release after the current tick so debounced subscriptions are ignored.
  setTimeout(() => useHistoryStore.getState().setApplying(false), 0)
}

export const redo = () => {
  const history = useHistoryStore.getState()
  const payload = history.redo()
  if (!payload) return
  history.setApplying(true)
  applyPayload(payload)
  setTimeout(() => useHistoryStore.getState().setApplying(false), 0)
}
