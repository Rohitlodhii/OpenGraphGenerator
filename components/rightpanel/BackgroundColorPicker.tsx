"use client"

import { useMeshStore } from "@/store/meshstore"
import { useState } from "react"
import ColorPopup from "../helpers/colorpopup"

function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function BackgroundColorPicker() {
  const {
    baseColor,
    setBaseColor,
    blobs,
    addBlob,
    removeBlob,
    updateBlob,
  } = useMeshStore()
  const [newColor, setNewColor] = useState("#ff0080")

  return (
    <div className="flex flex-col gap-4">

        
        <ColorPopup
            color={baseColor}
            onChange={setBaseColor}
            label="[Base Color]"
          />


         

      {/* Existing blobs/colors */}
      {blobs.map((blob, index) => (
        <div key={index} className="flex items-center gap-3">
           <div className="h-8 w-full p-1 flex items-center justify-between">
              <ColorPopup
                color={blob.color}
                onChange={(newColor) =>
                  updateBlob(index, { color: newColor })}
              />
                
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-md border"
              style={{
                background: hexToRgba(blob.color, blob.opacity),
              }}
            />
            <input
              type="color"
              value={blob.color}
              onChange={(e) =>
                updateBlob(index, { color: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col items-start">
            <input
              className="text-xs w-20 text-left"
              value={blob.color}
              onChange={(e) => updateBlob(index, { color: e.target.value })}
            />
            <div className="flex items-center gap-2 mt-1">
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(blob.opacity * 100)}
                onChange={(e) =>
                  updateBlob(index, { opacity: Number(e.target.value) / 100 })
                }
              />
              <span className="text-xs w-8">{Math.round(blob.opacity * 100)}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={blob.visible}
                onChange={(e) => updateBlob(index, { visible: e.target.checked })}
              />
              <span className="text-xs">Visible</span>
            </label>
            <button onClick={() => removeBlob(index)} className="text-xs">
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add New Color (blob) */}
      <div className="flex gap-2">
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
        />
        <button onClick={() => addBlob(newColor)}>
          Add Color
        </button>
      </div>

    </div>
  )
}