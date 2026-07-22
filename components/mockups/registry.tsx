import type { SVGProps } from "react"
import Iphone16 from "./iphone"
import iPadPro from "./ipad"
import Mac from "./mac"
import Safari from "./safari"

// Shared props every mockup device component accepts. Each renders a device
// frame with an optional image (`src`) embedded inside its screen; the screen's
// empty area is driven by `color` (mapped onto the SVG's `currentColor`).
export type MockupComponentProps = SVGProps<SVGSVGElement> & {
  width?: number
  height?: number
  src?: string
  url?: string
  fit?: "cover" | "contain"
  // Frame/border color scheme (screen color is separate — see `fill`/currentColor).
  theme?: "light" | "dark"
}

export type MockupDef = {
  id: string
  name: string
  Component: React.ComponentType<MockupComponentProps>
  // The device's native coordinate space (matches each component's viewBox and
  // internal path coordinates). Passed as width/height so the artwork renders
  // correctly; CSS then scales the SVG to fit the object box.
  nativeWidth: number
  nativeHeight: number
  // Intrinsic aspect ratio (width / height) used when the mockup is added.
  aspect: number
  // Default on-canvas width in px.
  defaultWidth: number
  // Whether this mockup exposes an editable address-bar URL (Safari only).
  hasUrl: boolean
  // Frame color scheme new objects are created with (matches each device's
  // original hardcoded look, so existing canvases render unchanged).
  defaultTheme: "light" | "dark"
}

export const mockups: MockupDef[] = [
  {
    id: "iphone",
    name: "iPhone 16",
    Component: Iphone16,
    nativeWidth: 200,
    nativeHeight: 400,
    aspect: 200 / 400,
    defaultWidth: 200,
    hasUrl: false,
    defaultTheme: "dark",
  },
  {
    id: "ipad",
    name: "iPad Pro",
    Component: iPadPro,
    nativeWidth: 520,
    nativeHeight: 400,
    aspect: 520 / 400,
    defaultWidth: 420,
    hasUrl: false,
    defaultTheme: "dark",
  },
  {
    id: "mac",
    name: "Mac",
    Component: Mac,
    nativeWidth: 600,
    nativeHeight: 500,
    aspect: 600 / 500,
    defaultWidth: 460,
    hasUrl: false,
    defaultTheme: "light",
  },
  {
    id: "safari",
    name: "Safari",
    Component: Safari,
    nativeWidth: 1203,
    nativeHeight: 753,
    aspect: 1203 / 753,
    defaultWidth: 520,
    hasUrl: true,
    defaultTheme: "light",
  },
]

export const getMockup = (id: string | undefined): MockupDef | undefined =>
  mockups.find((m) => m.id === id)
