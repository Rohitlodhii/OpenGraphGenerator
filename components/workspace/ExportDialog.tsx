"use client"

import React from "react"
import { Cloud, Copy, Download } from "lucide-react"
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { toPng, toJpeg, toSvg } from "html-to-image"
import { useCanvasStore } from "@/store/canvasstore"
import { authClient } from "@/lib/auth-client"
import {
  FREE_LIMIT,
  FreeLimitReachedError,
  freeUploadsRemaining,
  hasImgbbKey,
  uploadToImgbb,
} from "@/lib/imgbb"

type Format = "png" | "jpeg" | "svg"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SCALES = [1, 2, 3] as const
const TRANSPARENT_IMAGE_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="

// Skips the grid alignment overlay (and anything else marked export-ignore)
// so it never ends up baked into the exported image.
const exportFilter = (node: HTMLElement) => node.dataset?.exportIgnore !== "true"
const BASE_EXPORT_OPTIONS = {
  cacheBust: false,
  filter: exportFilter,
  imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER,
  onImageErrorHandler: () => undefined,
  skipFonts: true,
} as const

const ExportDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [format, setFormat] = React.useState<Format>("png")
  const [quality, setQuality] = React.useState(92)
  const [scale, setScale] = React.useState<number>(2)
  const [isExporting, setIsExporting] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [cloudStatus, setCloudStatus] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)
  const [remaining, setRemaining] = React.useState<number>(FREE_LIMIT)

  const { data: session } = authClient.useSession()

  const selectedObjectId = useCanvasStore((s) => s.selectedObjectId)
  const setSelectedObjectId = useCanvasStore((s) => s.setSelectedObjectId)

  const isRaster = format !== "svg"
  const ownKey = hasImgbbKey()
  const isSignedIn = !!session

  // Refresh free-tier count whenever the dialog opens.
  React.useEffect(() => {
    if (open) {
      setRemaining(freeUploadsRemaining())
      setCloudStatus(null)
    }
  }, [open])

  // Render the canvas to a dataURL in the current format. Temporarily clears
  // the selection so handles don't appear in the output.
  const renderDataUrl = async (): Promise<string | null> => {
    const stage = document.querySelector(".canvas-stage") as HTMLElement | null
    if (!stage) return null

    const previousSelected = selectedObjectId
    setSelectedObjectId(null)
    await new Promise<void>((r) => requestAnimationFrame(() => r()))
    await new Promise<void>((r) => requestAnimationFrame(() => r()))

    try {
      if (format === "png") {
        return await toPng(stage, { ...BASE_EXPORT_OPTIONS, pixelRatio: scale })
      }
      if (format === "jpeg") {
        return await toJpeg(stage, {
          ...BASE_EXPORT_OPTIONS,
          pixelRatio: scale,
          quality: quality / 100,
          backgroundColor: "#ffffff",
        })
      }
      return await toSvg(stage, BASE_EXPORT_OPTIONS)
    } finally {
      setSelectedObjectId(previousSelected)
    }
  }

  const handleExport = async () => {
    if (isExporting) return
    try {
      setIsExporting(true)
      const dataUrl = await renderDataUrl()
      if (!dataUrl) return

      const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")
      const link = document.createElement("a")
      link.href = dataUrl
      link.download = `preview-${stamp}.${format === "jpeg" ? "jpg" : format}`
      link.click()

      onOpenChange(false)
    } catch (error) {
      console.error("Failed to export:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleCloudUpload = async () => {
    if (isUploading || isExporting) return
    // imgbb only accepts raster; block SVG.
    if (!isRaster) {
      setCloudStatus("Cloud upload supports PNG or JPEG only.")
      return
    }
    if (!ownKey && freeUploadsRemaining() <= 0) {
      setCloudStatus(
        `Free limit of ${FREE_LIMIT} reached. Add your imgbb key in Profile → Connectors.`,
      )
      return
    }

    try {
      setIsUploading(true)
      setCloudStatus("Uploading…")
      setCopied(false)
      const dataUrl = await renderDataUrl()
      if (!dataUrl) {
        setCloudStatus("Nothing to upload.")
        return
      }

      const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-")
      const { url } = await uploadToImgbb(dataUrl, `preview-${stamp}`)

      setCloudStatus(url)
      setRemaining(freeUploadsRemaining())
    } catch (error) {
      if (error instanceof FreeLimitReachedError) {
        setCloudStatus(
          `Free limit of ${FREE_LIMIT} reached. Add your imgbb key in Profile → Connectors.`,
        )
      } else {
        console.error("Cloud upload failed:", error)
        setCloudStatus("Upload failed. Try again.")
      }
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="max-w-md">
        <DialogHeader>
          <DialogTitle>Export image</DialogTitle>
          <DialogDescription>
            Choose a format and quality, then download your canvas.
          </DialogDescription>
        </DialogHeader>

        <DialogPanel className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label>Format</Label>
            <ToggleGroup
              variant="outline"
              value={[format]}
              onValueChange={(v: string[]) => {
                if (v[0]) setFormat(v[0] as Format)
              }}
              className="w-full *:flex-1"
            >
              <ToggleGroupItem value="png">PNG</ToggleGroupItem>
              <ToggleGroupItem value="jpeg">JPEG</ToggleGroupItem>
              <ToggleGroupItem value="svg">SVG</ToggleGroupItem>
            </ToggleGroup>
          </div>

          {isRaster && (
            <div className="flex flex-col gap-2">
              <Label>Scale</Label>
              <ToggleGroup
                variant="outline"
                value={[String(scale)]}
                onValueChange={(v: string[]) => {
                  if (v[0]) setScale(Number(v[0]))
                }}
                className="w-full *:flex-1"
              >
                {SCALES.map((s) => (
                  <ToggleGroupItem key={s} value={String(s)}>
                    {s}x
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          {format === "jpeg" && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label>Quality</Label>
                <span className="text-muted-foreground text-sm tabular-nums">
                  {quality}%
                </span>
              </div>
              <Slider
                min={10}
                max={100}
                step={1}
                value={[quality]}
                onValueChange={(v) => setQuality(v[0])}
              />
            </div>
          )}
        </DialogPanel>

        {(cloudStatus || (isRaster && !isSignedIn) || (isRaster && !ownKey)) && (
          <div className="px-6 py-2 text-sm text-muted-foreground/70">
            {cloudStatus ? (
              cloudStatus.startsWith("http") ? (
                <div className="border rounded-md p-2 flex items-center gap-2">
                  <a
                    href={cloudStatus}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 truncate min-w-0 flex-1"
                  >
                    {cloudStatus}
                  </a>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0"
                    onClick={async () => {
                      await navigator.clipboard.writeText(cloudStatus)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                  >
                    <Copy className={`size-3.5 ${copied ? "text-green-500" : ""}`} />
                  </Button>
                </div>
              ) : (
                cloudStatus
              )
            ) : !isSignedIn ? (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                onClick={() => authClient.signIn.social({ provider: "github", callbackURL: window.location.href })}
              >
                Sign in with GitHub to upload to the cloud.
              </Button>
            ) : (
              <span className="tabular-nums">
                {remaining} of {FREE_LIMIT} free cloud uploads left.
              </span>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleCloudUpload}
            disabled={isUploading || isExporting || !isRaster || !isSignedIn}
            className="gap-2"
          >
            <Cloud className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload to cloud"}
          </Button>
          <Button onClick={handleExport} disabled={isExporting || isUploading} className="gap-2">
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

export default ExportDialog
