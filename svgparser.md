
# 🏗️ Production-Ready Prompt: SVG Import System for Graphics Editor

## Context

You are building a **production-grade SVG import pipeline** for a browser-based graphics editor (similar to Figma/Canva). The editor operates on an internal JSON object model — **never on raw SVG strings** after import. SVG is strictly an interchange format.

The pipeline must use **svgson** as the parser and **transformation-matrix** (npm package) for transform math. The system must handle SVGs from Figma, Illustrator, Inkscape, Canva, Icons8, Lucide, Heroicons, and AI-generated SVGs.

---

## 🎯 Goal

Build a complete, modular, extensible SVG-to-Canvas import system with the following architecture:

```
SVG File (string)
    │
    ▼
svgson.parse() → SVG AST
    │
    ▼
Importer Engine (registry-based dispatch)
    │
    ├── Element Converters (rect, circle, path, text, image, etc.)
    ├── Transform Processor (matrix decomposition)
    ├── Style Resolver (inheritance + inline styles)
    ├── Gradient/Defs Handler
    └── Group Flattening / Nesting
    │
    ▼
Internal CanvasObject Model (JSON)
    │
    ▼
Canvas Renderer / Property Inspector / Undo-Redo
```

---

## 📦 Dependencies

You MUST use these exact packages:

```json
{
  "svgson": "^5.x",
  "transformation-matrix": "^2.x",
  "d-path-parser": "^1.x",
  "uuid": "^9.x" // or nanoid for IDs
}
```

- **svgson**: For SVG string → AST parsing. API: `svgson.parse(input)`, `svgson.parseSync(input)`, `svgson.stringify(ast)`. Use `camelcase: true` option.
- **transformation-matrix**: For transform string parsing and matrix decomposition. Use `fromTransformAttribute()`, `compose()`, `decomposeTSR()`, `applyToPoint()`.
- **d-path-parser**: For parsing SVG `<path d="...">` into manipulable command arrays.

---

## 🧱 Internal Object Model (The "CanvasObject" Schema)

Every imported element MUST be converted to this schema. The rest of the editor (renderer, selection, property panel, undo/redo) operates **only** on this model.

```ts
interface Point { x: number; y: number; }

interface CanvasObject {
  id: string;                    // nanoid / uuid v4
  type: 
    | "group" 
    | "rect" 
    | "circle" 
    | "ellipse" 
    | "line" 
    | "polygon" 
    | "polyline" 
    | "path" 
    | "text" 
    | "image";

  name?: string;                 // from id or class attribute

  // Spatial properties (all in local coordinate space)
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation: number;              // degrees, 0-360
  scaleX: number;                // default 1
  scaleY: number;                // default 1

  visible: boolean;
  locked?: boolean;

  opacity: number;               // 0-1, merged from opacity + fill-opacity/stroke-opacity

  // Style object (resolved, not inherited)
  style: {
    fill?: string;               // resolved color, gradient ref, or "none"
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
    strokeOpacity?: number;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    strokeDasharray?: string;
  };

  // Type-specific data
  data?: {
    // rect: nothing extra
    // circle
    radius?: number;
    // ellipse
    rx?: number;
    ry?: number;
    // line
    x1?: number; y1?: number;
    x2?: number; y2?: number;
    // path
    path?: string;               // normalized absolute path data
    pathCommands?: PathCommand[]; // parsed from d-path-parser
    // polygon / polyline
    points?: Point[];
    // text
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    textAnchor?: "start" | "middle" | "end";
    // image
    imageUrl?: string;
    imageWidth?: number;
    imageHeight?: number;
    // group
    // (children handled separately)
  };

  // Transform (for advanced cases where decomposition fails)
  transformMatrix?: [number, number, number, number, number, number]; // [a, b, c, d, e, f]

  // Hierarchy
  children?: CanvasObject[];

  // Metadata
  svgSource?: {
    elementName: string;
    originalAttributes: Record<string, string>;
  };
}
```

---

## 🔧 Core Requirements

### 1. Registry-Based Converter Architecture

DO NOT use a giant switch statement. Implement a **converter registry**:

```ts
interface ElementConverter<T extends CanvasObject = CanvasObject> {
  tagName: string;
  convert(node: SvgsonNode, context: ImportContext): T | T[] | null;
}

class ImporterRegistry {
  private converters = new Map<string, ElementConverter>();
  
  register(converter: ElementConverter): void;
  convert(node: SvgsonNode, context: ImportContext): CanvasObject | CanvasObject[] | null;
}
```

**Built-in converters to implement:**
- `SvgConverter` (root `<svg>` — extracts viewBox, width, height)
- `GroupConverter` (`<g>` — creates nested group with inherited styles)
- `RectConverter` (`<rect>` — x, y, width, height, rx, ry)
- `CircleConverter` (`<circle>` — cx, cy, r)
- `EllipseConverter` (`<ellipse>` — cx, cy, rx, ry)
- `LineConverter` (`<line>` — x1, y1, x2, y2)
- `PolylineConverter` (`<polyline>` — points array)
- `PolygonConverter` (`<polygon>` — points array, auto-close)
- `PathConverter` (`<path>` — parse `d` with d-path-parser, normalize to absolute)
- `TextConverter` (`<text>`, `<tspan>` — text content, font properties)
- `ImageConverter` (`<image>` — href/xlink:href, width, height)
- `DefsConverter` (`<defs>` — store gradients, clipPaths, masks for reference)
- `GradientConverter` (`<linearGradient>`, `<radialGradient>` — stops, transforms)
- `ClipPathConverter` (`<clipPath>` — parse children, store for reference)
- `MaskConverter` (`<mask>` — parse children, store for reference)

**Unknown elements:** Skip gracefully with a dev-mode warning. Do NOT crash.

---

### 2. Recursive Tree Traversal with Context

The importer must walk the SVG AST recursively while maintaining an **ImportContext** stack:

```ts
interface ImportContext {
  // Inherited state
  parentStyles: ResolvedStyles;
  parentTransform: Matrix;       // accumulated transform matrix
  defs: Map<string, DefEntry>;   // id → gradient/clipPath/mask
  viewBox: { x: number; y: number; width: number; height: number } | null;
  
  // Settings
  options: {
    flattenGroups?: boolean;     // optional: flatten single-child groups
    preserveIds?: boolean;       // keep original SVG ids as names
    ignoreUnsupported?: boolean; // skip vs error on unsupported
  };
}
```

**Traversal rules:**
- Depth-first, left-to-right
- Each child inherits parent's resolved styles (CSS cascade-like)
- Each child accumulates parent's transform matrix
- `<defs>` children are parsed first and stored in context.defs by `id`
- `<use>` elements must resolve their `href`/`xlink:href` reference

---

### 3. Transform Handling (CRITICAL)

SVG transforms must be **fully parsed, composed, and decomposed** into editable properties.

**Parsing:** Use `transformation-matrix.fromTransformAttribute(transformString)` to parse:
- `translate(tx, ty)`
- `rotate(angle, cx?, cy?)`
- `scale(sx, sy?)`
- `skewX(angle)`
- `skewY(angle)`
- `matrix(a, b, c, d, e, f)`

**Composition:** Multiply transforms in order using `transformation-matrix.compose()` or `transform()`.

**Decomposition:** Use `transformation-matrix.decomposeTSR(matrix)` to extract:
- `translate: { tx, ty }`
- `rotation: angle` (in radians → convert to degrees)
- `scale: { sx, sy }`

**Assignment to CanvasObject:**
- `x`, `y` ← from decomposed translation (plus element's own x/y/cx/cy)
- `rotation` ← from decomposed rotation
- `scaleX`, `scaleY` ← from decomposed scale
- If decomposition is ambiguous (e.g. non-uniform scale + rotation), store the raw `transformMatrix` on the object and set a flag `hasComplexTransform: true`

**Special cases:**
- `rotate(angle, cx, cy)` → decompose as: translate(cx,cy) → rotate → translate(-cx,-cy)
- Nested `<g>` transforms → multiply parent matrix × child matrix
- If final matrix cannot be cleanly decomposed (shear, non-affine), preserve as `transformMatrix`

---

### 4. Style Resolution System

Implement a **style resolver** that handles three sources in priority order (highest to lowest):

1. **Inline attributes** (`fill="red"`, `stroke-width="2"`)
2. **`style=""` attribute** (parse with a simple CSS parser: split by `;`, then by `:`)
3. **Inherited parent styles** (from `<g>` ancestors)

**Rules:**
- `currentColor` → resolve against inherited color or default to `#000000`
- `none` → explicit no-fill / no-stroke
- `inherit` → use parent value
- Percentage values (e.g. `stroke-width="50%"`) → resolve against viewport or element bounds
- `opacity`, `fill-opacity`, `stroke-opacity` → multiply together for final `opacity`

**Color parsing:**
- Named colors: `red`, `blue`, `transparent`
- Hex: `#fff`, `#ffffff`, `#ffffffff`
- RGB/RGBA: `rgb(255, 0, 0)`, `rgba(255, 0, 0, 0.5)`
- HSL/HSLA
- URL references: `url(#gradientId)` → store as gradient reference string, resolve later

---

### 5. Gradient, ClipPath, and Mask Support

**Gradients (`<linearGradient>`, `<radialGradient>`):**
- Parse `<stop>` children: offset, stop-color, stop-opacity
- Parse gradientTransform using the same transform pipeline
- Store in `context.defs` keyed by `id`
- When an element uses `fill="url(#grad1)"`, store the gradient reference in `style.fill`
- The renderer (out of scope) will handle rendering; the importer just preserves the reference

**ClipPaths (`<clipPath>`):**
- Parse children recursively
- Store in `context.defs` keyed by `id`
- Attach `clipPath` reference to CanvasObject when `clip-path="url(#id)"` is found

**Masks (`<mask>`):**
- Parse children recursively
- Store in `context.defs` keyed by `id`
- Attach `mask` reference to CanvasObject when `mask="url(#id)"` is found

---

### 6. Path Data Normalization

For `<path>` elements:
1. Parse `d` attribute using **d-path-parser**
2. Convert all commands to **absolute** coordinates
3. Store the normalized path string in `data.path`
4. Store the parsed command array in `data.pathCommands`

**Why normalize?** The editor's path manipulation tools (bezier handles, point editing) require absolute coordinates. Relative commands make math much harder.

---

### 7. ViewBox and Coordinate System Handling

The root `<svg>` element defines the coordinate system:
- Extract `viewBox="minX minY width height"`
- Extract `width` and `height` (may be percentages or missing — default to viewBox dimensions)
- If viewBox exists but x/y are non-zero, apply an implicit translate to all children
- `preserveAspectRatio` → handle `xMidYMid meet` (default) vs `slice` vs `none`
- If no viewBox and no width/height, default to `0 0 300 150` (per SVG spec)

---

### 8. Text Handling

`<text>` and `<tspan>` elements:
- Extract text content (concatenate child text nodes)
- Parse `x`, `y` (may be lists for multi-position text — take first)
- Parse `font-family`, `font-size`, `font-weight`, `text-anchor`
- `text-anchor`: `start` (default), `middle`, `end` → affects bounding box calculations
- For `<tspan>` inside `<text>`, merge attributes and accumulate text
- If text has transforms, apply same decomposition as shapes

---

### 9. Image Handling

`<image>` elements:
- Extract `href` or `xlink:href` (xlink is deprecated but common in Illustrator exports)
- Extract `x`, `y`, `width`, `height`
- Store URL in `data.imageUrl`
- If width/height missing, set to `0` and mark as `needsDimensionResolution: true`

---

### 10. Error Handling & Resilience

The importer must be **bulletproof**:

| Scenario | Behavior |
|----------|----------|
| Malformed SVG | Catch parse error, return `{ success: false, error: "Parse failed", details: ... }` |
| Unsupported element | Skip with warning (dev mode log), continue importing siblings |
| Missing referenced gradient | Log warning, fallback to `fill: "none"` or `fill: "#000000"` |
| Invalid transform string | Skip transform, log warning, continue |
| Invalid path data | Skip path, log warning, continue |
| Circular `<use>` references | Detect and break cycle, log warning |
| Zero-width/height elements | Import but mark as `visible: false` or `degenerate: true` |
| Negative width/height | Take absolute value, log warning |

**Return type:**
```ts
interface ImportResult {
  success: boolean;
  root: CanvasObject | null;     // The root group/frame
  warnings: ImportWarning[];
  stats: {
    elementCount: number;
    unsupportedElements: string[];
    parseTimeMs: number;
  };
}
```

---

### 11. Performance Requirements

- **Single-pass traversal** where possible. Do not re-walk the tree.
- **Lazy processing**: Gradients, clipPaths, and masks are parsed on first reference, not during initial tree walk.
- **Object pooling**: Reuse style resolver objects where possible (avoid creating new objects per node).
- **Large SVG support**: Must handle SVGs with 10,000+ elements without blocking the main thread. Consider yielding control every N elements if running in browser.

---

### 12. Testing Requirements

Provide comprehensive tests covering:

1. **Unit tests for each converter** (rect, circle, path, text, etc.)
2. **Transform decomposition tests** (all 6 SVG transform functions, nested groups)
3. **Style inheritance tests** (inline vs style attr vs parent inheritance)
4. **Edge cases**: empty SVG, missing viewBox, invalid colors, self-closing tags
5. **Real-world SVGs**: Figma export, Illustrator export, Inkscape export, Lucide icons, Heroicons
6. **Benchmark tests**: Import 1000-element SVG under 50ms

---

## 📁 File Structure

```
src/
  svg-import/
    index.ts                    # Public API: importSVG(svgString): ImportResult
    types.ts                    # CanvasObject, ImportContext, ImportResult
    registry.ts                 # ImporterRegistry class
    context.ts                  # ImportContext builder & style resolver
    transform.ts                # Transform parsing, composition, decomposition
    style-resolver.ts           # Style inheritance & CSS parsing
    converters/
      svg-converter.ts
      group-converter.ts
      rect-converter.ts
      circle-converter.ts
      ellipse-converter.ts
      line-converter.ts
      polyline-converter.ts
      polygon-converter.ts
      path-converter.ts
      text-converter.ts
      image-converter.ts
      defs-converter.ts
      gradient-converter.ts
      clip-path-converter.ts
      mask-converter.ts
      use-converter.ts
      index.ts                  # Register all converters
    utils/
      color-parser.ts           # Parse hex, rgb, hsl, named colors
      id-generator.ts           # nanoid wrapper
      path-normalizer.ts        # Convert relative → absolute path commands
      number-parser.ts          # Parse SVG numbers (handles units, percentages)
      viewbox-parser.ts         # Parse viewBox string
      warnings.ts               # Warning collector
    __tests__/
      integration.test.ts       # Full pipeline tests
      transform.test.ts
      style-resolver.test.ts
      converters.test.ts
      fixtures/                 # Real SVG files for testing
```

---

## 🚀 Public API

```ts
// src/svg-import/index.ts
import { parseSync } from 'svgson';
import { ImporterRegistry } from './registry';
import { buildImportContext } from './context';
import { registerDefaultConverters } from './converters';

export interface ImportOptions {
  flattenGroups?: boolean;
  preserveIds?: boolean;
  ignoreUnsupported?: boolean;
  onWarning?: (warning: ImportWarning) => void;
}

export function importSVG(svgString: string, options: ImportOptions = {}): ImportResult {
  const startTime = performance.now();
  
  // 1. Parse SVG string to AST
  const ast = parseSync(svgString, { camelcase: true });
  
  // 2. Build context
  const context = buildImportContext(options);
  
  // 3. Create registry with all converters
  const registry = new ImporterRegistry();
  registerDefaultConverters(registry);
  
  // 4. Convert root
  const root = registry.convert(ast, context);
  
  // 5. Return result
  return {
    success: root !== null,
    root,
    warnings: context.warnings,
    stats: {
      elementCount: context.elementCount,
      unsupportedElements: context.unsupportedElements,
      parseTimeMs: performance.now() - startTime,
    }
  };
}
```

---

## ✅ Acceptance Criteria

Before marking this complete, verify:

- [ ] Can import a simple 24×24 Lucide icon and edit fill/stroke/width/height
- [ ] Can import a complex Figma-exported illustration with groups and gradients
- [ ] Can import an Illustrator SVG with text, paths, and transforms
- [ ] Nested `<g>` transforms correctly decompose to x/y/rotation/scale
- [ ] Inline `style=""` attributes are parsed and editable in the property panel
- [ ] Unknown SVG elements are skipped without crashing
- [ ] Malformed SVGs return a graceful error, not an exception
- [ ] 10,000-element SVG imports in under 100ms
- [ ] All tests pass with >90% coverage
- [ ] TypeScript types are complete and exported

---

## 🎓 Key Research References

- **svgson API**: `parse()`, `parseSync()`, `stringify()`, `transformNode`, `camelcase` options 
- **Transformation Matrix Decomposition**: Use `fromTransformAttribute()` and `decomposeTSR()` from the `transformation-matrix` npm package 
- **SVG Path Parsing**: Use `d-path-parser` for compact, fast path `d` attribute parsing 
- **Matrix Decomposition Math**: LU and QR decomposition approaches for generic `matrix(a,b,c,d,e,f)` 
- **Real-world SVG Import Issues**: Gradients break, text misplaces, strokes disappear, masks fail — design for resilience 
- **SVG Path Data Complexity**: Implicit commands, shorthand forms, and normalization requirements 

---

This prompt is ready to feed into any capable AI coding assistant or senior engineer. It covers architecture, APIs, edge cases, performance, testing, and real-world compatibility. Good luck building it! 🚀