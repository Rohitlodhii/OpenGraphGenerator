export type CssGradientKind =
  | "linear"
  | "radial"
  | "repeating-linear"
  | "repeating-radial"

export type CssGradientStop = {
  id: string
  color: string
  opacity: number
  position: string
}

export type CssGradientLayer = {
  id: string
  kind: CssGradientKind
  enabled: boolean
  descriptor: string
  size: string
  position: string
  stops: CssGradientStop[]
}

export type EditableCssPreset = {
  wrapperClassName: string
  innerStyle: Record<string, string>
  backgroundColor: string
  backgroundEnabled: boolean
  gradientLayers: CssGradientLayer[]
}

const BACKGROUND_CLASS_COLORS: Record<string, string> = {
  "bg-black": "#000000",
  "bg-white": "#ffffff",
}

const createPartId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`

export const splitCssList = (value: string) => {
  const parts: string[] = []
  let current = ""
  let depth = 0
  let quote = ""

  for (const character of value) {
    if (quote) {
      current += character
      if (character === quote) quote = ""
      continue
    }

    if (character === "'" || character === '"') {
      quote = character
      current += character
      continue
    }

    if (character === "(") depth += 1
    if (character === ")") depth = Math.max(0, depth - 1)

    if (character === "," && depth === 0) {
      parts.push(current.trim())
      current = ""
      continue
    }

    current += character
  }

  if (current.trim()) parts.push(current.trim())
  return parts
}

const normalizeHex = (value: string) => {
  const hex = value.replace("#", "")
  if (hex.length === 3 || hex.length === 4) {
    return `#${hex
      .slice(0, 3)
      .split("")
      .map((part) => `${part}${part}`)
      .join("")}`.toLowerCase()
  }
  return `#${hex.slice(0, 6)}`.toLowerCase()
}

const colorTokenToHex = (token: string) => {
  const lower = token.toLowerCase()
  if (lower === "transparent") return { color: "#000000", opacity: 0 }
  if (lower === "black") return { color: "#000000", opacity: 100 }
  if (lower === "white") return { color: "#ffffff", opacity: 100 }

  if (lower.startsWith("#")) {
    const hex = lower.replace("#", "")
    const alpha =
      hex.length === 4
        ? parseInt(`${hex[3]}${hex[3]}`, 16)
        : hex.length === 8
          ? parseInt(hex.slice(6, 8), 16)
          : 255
    return {
      color: normalizeHex(lower),
      opacity: Math.round((alpha / 255) * 100),
    }
  }

  const rgbaMatch = lower.match(/^rgba?\(([^)]+)\)$/)
  if (rgbaMatch) {
    const channels = rgbaMatch[1].split(",").map((part) => part.trim())
    const red = Math.max(0, Math.min(255, Number(channels[0]) || 0))
    const green = Math.max(0, Math.min(255, Number(channels[1]) || 0))
    const blue = Math.max(0, Math.min(255, Number(channels[2]) || 0))
    const alpha = channels[3] === undefined ? 1 : Math.max(0, Math.min(1, Number(channels[3])))
    const color = `#${[red, green, blue]
      .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
      .join("")}`
    return { color, opacity: Math.round(alpha * 100) }
  }

  return { color: "#000000", opacity: 100 }
}

const parseGradientStop = (
  value: string,
  layerIndex: number,
  stopIndex: number,
): CssGradientStop | null => {
  const match = value
    .trim()
    .match(/^(rgba?\([^)]*\)|#[0-9a-fA-F]{3,8}|transparent|black|white)\s*(.*)$/i)
  if (!match) return null

  const parsedColor = colorTokenToHex(match[1])
  return {
    id: `gradient-${layerIndex}-stop-${stopIndex}`,
    color: parsedColor.color,
    opacity: parsedColor.opacity,
    position: match[2].trim(),
  }
}

const parseGradientLayer = (
  value: string,
  index: number,
  size: string,
  position: string,
): CssGradientLayer | null => {
  const match = value
    .trim()
    .match(/^(repeating-)?(linear|radial)-gradient\(([\s\S]*)\)$/i)
  if (!match) return null

  const kind = `${match[1] ?? ""}${match[2]}` as CssGradientKind
  const parts = splitCssList(match[3])
  const firstStop = parseGradientStop(parts[0] ?? "", index, 0)
  const descriptor = firstStop
    ? kind.includes("linear")
      ? "to bottom"
      : "ellipse at center"
    : parts.shift() ?? ""
  const stops = parts
    .map((part, stopIndex) => parseGradientStop(part, index, stopIndex))
    .filter((stop): stop is CssGradientStop => Boolean(stop))

  if (stops.length < 2) return null

  return {
    id: `gradient-${index}`,
    kind,
    enabled: true,
    descriptor,
    size: size || "auto",
    position: position || "0 0",
    stops,
  }
}

const extractWrapperBackground = (wrapperClassName: string) => {
  let backgroundColor = ""
  const classes = wrapperClassName.split(/\s+/).filter(Boolean)
  const filtered = classes.filter((className) => {
    if (BACKGROUND_CLASS_COLORS[className]) {
      backgroundColor = BACKGROUND_CLASS_COLORS[className]
      return false
    }

    const arbitraryMatch = className.match(/^bg-\[(#[0-9a-fA-F]{3,8})\]$/)
    if (arbitraryMatch) {
      backgroundColor = normalizeHex(arbitraryMatch[1])
      return false
    }

    return true
  })

  return {
    backgroundColor,
    wrapperClassName: filtered.join(" "),
  }
}

const isSolidColor = (value: string) =>
  /^(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|transparent|black|white)$/i.test(value.trim())

export const createEditableCssPreset = (
  wrapperClassName: string,
  sourceStyle: Record<string, string>,
): EditableCssPreset => {
  const wrapper = extractWrapperBackground(wrapperClassName)
  const innerStyle = { ...sourceStyle }
  let backgroundColor = wrapper.backgroundColor

  if (innerStyle.background && isSolidColor(innerStyle.background)) {
    backgroundColor = colorTokenToHex(innerStyle.background).color
    delete innerStyle.background
  } else if (innerStyle.background?.includes("gradient(")) {
    const backgroundParts = splitCssList(innerStyle.background)
    const gradients = backgroundParts.filter((part) => part.includes("gradient("))
    const solidColor = backgroundParts.find((part) => isSolidColor(part))
    if (gradients.length > 0) {
      innerStyle.backgroundImage = gradients.join(", ")
      delete innerStyle.background
    }
    if (solidColor) {
      backgroundColor = colorTokenToHex(solidColor).color
    }
  }

  const gradientValues = splitCssList(innerStyle.backgroundImage ?? "")
  const sizes = splitCssList(innerStyle.backgroundSize ?? "")
  const positions = splitCssList(innerStyle.backgroundPosition ?? "")
  const gradientLayers = gradientValues
    .map((gradient, index) =>
      parseGradientLayer(
        gradient,
        index,
        sizes[index] ?? sizes[sizes.length - 1] ?? "auto",
        positions[index] ?? positions[positions.length - 1] ?? "0 0",
      ),
    )
    .filter((layer): layer is CssGradientLayer => Boolean(layer))

  if (gradientLayers.length === gradientValues.length && gradientLayers.length > 0) {
    delete innerStyle.backgroundImage
    delete innerStyle.backgroundSize
    delete innerStyle.backgroundPosition
  }

  return {
    wrapperClassName: wrapper.wrapperClassName,
    innerStyle,
    backgroundColor: backgroundColor || "#ffffff",
    backgroundEnabled: Boolean(backgroundColor),
    gradientLayers,
  }
}

const hexToRgb = (color: string) => {
  const normalized = normalizeHex(color).replace("#", "")
  return {
    red: parseInt(normalized.slice(0, 2), 16),
    green: parseInt(normalized.slice(2, 4), 16),
    blue: parseInt(normalized.slice(4, 6), 16),
  }
}

const buildGradientStop = (stop: CssGradientStop) => {
  const { red, green, blue } = hexToRgb(stop.color)
  const alpha = Math.max(0, Math.min(100, stop.opacity)) / 100
  return `rgba(${red}, ${green}, ${blue}, ${alpha})${stop.position ? ` ${stop.position}` : ""}`
}

export const buildCssGradientStyle = (
  sourceStyle: Record<string, string>,
  layers?: CssGradientLayer[],
) => {
  if (!layers) return sourceStyle

  const enabledLayers = layers.filter((layer) => layer.enabled)
  const style = { ...sourceStyle }

  if (enabledLayers.length === 0) {
    style.backgroundImage = "none"
    delete style.backgroundSize
    delete style.backgroundPosition
    return style
  }

  style.backgroundImage = enabledLayers
    .map(
      (layer) =>
        `${layer.kind}-gradient(${layer.descriptor}, ${layer.stops
          .map(buildGradientStop)
          .join(", ")})`,
    )
    .join(", ")
  style.backgroundSize = enabledLayers.map((layer) => layer.size || "auto").join(", ")
  style.backgroundPosition = enabledLayers
    .map((layer) => layer.position || "0 0")
    .join(", ")
  return style
}

export const createGradientLayer = (): CssGradientLayer => ({
  id: createPartId("gradient"),
  kind: "linear",
  enabled: true,
  descriptor: "to bottom",
  size: "100% 100%",
  position: "0 0",
  stops: [
    {
      id: createPartId("stop"),
      color: "#ffffff",
      opacity: 100,
      position: "0%",
    },
    {
      id: createPartId("stop"),
      color: "#000000",
      opacity: 0,
      position: "100%",
    },
  ],
})

export const duplicateGradientLayer = (layer: CssGradientLayer): CssGradientLayer => ({
  ...layer,
  id: createPartId("gradient"),
  stops: layer.stops.map((stop) => ({
    ...stop,
    id: createPartId("stop"),
  })),
})

export const createGradientStop = (): CssGradientStop => ({
  id: createPartId("stop"),
  color: "#000000",
  opacity: 100,
  position: "50%",
})

export const recolorGradientLayers = (
  layers: CssGradientLayer[],
  color: string,
): CssGradientLayer[] =>
  layers.map((layer) => ({
    ...layer,
    stops: layer.stops.map((stop) => ({
      ...stop,
      color,
    })),
  }))
