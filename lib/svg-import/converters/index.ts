import { ImporterRegistry } from "../registry"
import { SvgConverter } from "./svg-converter"
import { GroupConverter } from "./group-converter"
import { RectConverter } from "./rect-converter"
import { CircleConverter } from "./circle-converter"
import { EllipseConverter } from "./ellipse-converter"
import { LineConverter } from "./line-converter"
import { PolylineConverter, PolygonConverter } from "./poly-converter"
import { PathConverter } from "./path-converter"
import { TextConverter } from "./text-converter"
import { ImageConverter } from "./image-converter"
import { DefsConverter, ClipPathConverter, MaskConverter } from "./defs-converter"
import {
  LinearGradientConverter,
  RadialGradientConverter,
} from "./gradient-converter"
import { UseConverter } from "./use-converter"

export function registerDefaultConverters(registry: ImporterRegistry): void {
  const all = [
    SvgConverter,
    GroupConverter,
    RectConverter,
    CircleConverter,
    EllipseConverter,
    LineConverter,
    PolylineConverter,
    PolygonConverter,
    PathConverter,
    TextConverter,
    ImageConverter,
    DefsConverter,
    ClipPathConverter,
    MaskConverter,
    LinearGradientConverter,
    RadialGradientConverter,
    UseConverter,
  ]
  for (const c of all) registry.register(c)
}
