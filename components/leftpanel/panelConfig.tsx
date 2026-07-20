import React from "react"
import {
  Grid2x2,
  ImageIcon,
  LayoutTemplate,
  Palette,
  Proportions,
  Shapes,
  Smartphone,
  Type,
  Wrench,
} from "lucide-react"
import TemplateList from "./TemplateList"
import { DimensionControls } from "../rightpanel/DimensionControls"
import BackgroundPanel from "../rightpanel/BackgroundPanel"
import ShapesPanel from "../rightpanel/ShapesPanel"
import PatternsPanel from "../rightpanel/PatternsPanel"
import TextAddingPanel from "../rightpanel/TextAddingPanel"
import ImageAddingPanel from "../rightpanel/ImageAddingPanel"
import MockupsPanel from "../rightpanel/MockupsPanel"
import ToolsPanel from "../rightpanel/ToolsPanel"

export type LeftTab =
  | "templates"
  | "size"
  | "background"
  | "patterns"
  | "shapes"
  | "text"
  | "images"
  | "mockups"
  | "tools"

export const tabs: { id: LeftTab; label: string; icon: React.ElementType }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "size", label: "Size", icon: Proportions },
  { id: "background", label: "Background", icon: Palette },
  { id: "patterns", label: "Patterns", icon: Grid2x2 },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "mockups", label: "Mockups", icon: Smartphone },
  { id: "tools", label: "Tools", icon: Wrench },
]

export const tabTitles: Record<LeftTab, string> = {
  templates: "Templates",
  size: "Size",
  background: "Background",
  patterns: "Patterns",
  shapes: "Shapes",
  text: "Text",
  images: "Images",
  mockups: "Mockups",
  tools: "Tools",
}

export const objectTypeToTab: Record<string, LeftTab> = {
  text: "text",
  image: "images",
  shape: "shapes",
  pattern: "patterns",
  mockup: "mockups",
}

export const PanelContent = ({ tab }: { tab: LeftTab }) => {
  switch (tab) {
    case "templates":
      return <TemplateList />
    case "size":
      return <DimensionControls />
    case "background":
      return <BackgroundPanel chromeless />
    case "patterns":
      return <PatternsPanel chromeless />
    case "shapes":
      return <ShapesPanel chromeless />
    case "text":
      return <TextAddingPanel chromeless />
    case "images":
      return <ImageAddingPanel chromeless />
    case "mockups":
      return <MockupsPanel chromeless />
    case "tools":
      return <ToolsPanel />
    default:
      return null
  }
}
