import React from "react"
import {
  Grid2x2,
  ImageIcon,
  LayoutTemplate,
  Palette,
  Proportions,
  Shapes,
  Sparkles,
  Type,
} from "lucide-react"
import TemplateList from "./TemplateList"
import { DimensionControls } from "../rightpanel/DimensionControls"
import BackgroundPanel from "../rightpanel/BackgroundPanel"
import ShapesPanel from "../rightpanel/ShapesPanel"
import PatternsPanel from "../rightpanel/PatternsPanel"
import TextAddingPanel from "../rightpanel/TextAddingPanel"
import ImageAddingPanel from "../rightpanel/ImageAddingPanel"
import IllustrationsPanel from "../rightpanel/IllustrationsPanel"

export type LeftTab =
  | "templates"
  | "size"
  | "background"
  | "patterns"
  | "shapes"
  | "text"
  | "images"
  | "illustrations"

export const tabs: { id: LeftTab; label: string; icon: React.ElementType }[] = [
  { id: "templates", label: "Templates", icon: LayoutTemplate },
  { id: "size", label: "Size", icon: Proportions },
  { id: "background", label: "Background", icon: Palette },
  { id: "patterns", label: "Patterns", icon: Grid2x2 },
  { id: "shapes", label: "Shapes", icon: Shapes },
  { id: "text", label: "Text", icon: Type },
  { id: "images", label: "Images", icon: ImageIcon },
  { id: "illustrations", label: "Illustrations", icon: Sparkles },
]

export const tabTitles: Record<LeftTab, string> = {
  templates: "Templates",
  size: "Size",
  background: "Background",
  patterns: "Patterns",
  shapes: "Shapes",
  text: "Text",
  images: "Images",
  illustrations: "Illustrations",
}

export const objectTypeToTab: Record<string, LeftTab> = {
  text: "text",
  image: "images",
  shape: "shapes",
  pattern: "patterns",
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
    case "illustrations":
      return <IllustrationsPanel />
    default:
      return null
  }
}
