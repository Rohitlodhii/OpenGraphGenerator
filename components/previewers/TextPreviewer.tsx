"use client"

import React from "react"
import { CanvasObject } from "@/store/canvasstore"
import { loadFontByFamily } from "@/lib/font-loader"
import { familyNameFromValue } from "@/lib/fonts"

type TextPreviewerProps = {
  object: CanvasObject
  style?: React.CSSProperties
  isSelected?: boolean
  isEditing?: boolean
  onDoubleClick?: () => void
  onChange?: (value: string) => void
  onBlur?: () => void
}

const TextPreviewer: React.FC<TextPreviewerProps> = ({
  object,
  style,
  isSelected = false,
  isEditing = false,
  onDoubleClick,
  onChange,
  onBlur,
}) => {
  const normalizedOpacity = Math.max(0, Math.min(100, object.fontOpacity ?? 100)) / 100

  // Ensure the object's font face is loaded (covers text restored from saved
  // templates, not just fonts chosen via the picker). Cached after first load.
  React.useEffect(() => {
    const family = familyNameFromValue(object.fontFamily)
    if (family) loadFontByFamily(family)
  }, [object.fontFamily])

  const textStyle: React.CSSProperties = {
    ...style,
    color: object.textColor ?? "#ffffff",
    opacity: normalizedOpacity,
    fontSize: object.fontSize ?? 36,
    fontWeight: object.fontWeight ?? 700,
    fontStyle: object.fontStyle ?? "normal",
    fontFamily: object.fontFamily ?? "Poppins, sans-serif",
    lineHeight: object.lineHeight ?? 1.2,
    letterSpacing: `${object.letterSpacing ?? 0}px`,
    textDecoration: object.textDecoration ?? "none",
    textAlign: object.textAlign ?? "left",
    textIndent: object.textIndent ?? 0,
    textShadow:
      (object.textShadow ?? 0) > 0
        ? `0 2px ${object.textShadow ?? 0}px ${object.textShadowColor ?? "rgba(0,0,0,0.55)"}`
        : "none",
    whiteSpace: "pre-wrap",
    width: object.width ?? 360,
    minHeight: object.height ?? 80,
    padding: 8,
    boxSizing: "border-box",
    border: isSelected ? "1px dashed rgba(255,255,255,0.6)" : "none",
    borderRadius: 6,
  }

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={object.content ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        onBlur={onBlur}
        style={{
          ...textStyle,
          background: "transparent",
          outline: "none",
          resize: "none",
        }}
      />
    )
  }

  return (
    <div
      style={textStyle}
      onDoubleClick={onDoubleClick}
    >
      {object.content ?? "Text"}
    </div>
  )
}

export default TextPreviewer
