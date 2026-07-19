import { ImportWarning } from "../types"

export class WarningCollector {
  private warnings: ImportWarning[] = []
  private onWarning?: (warning: ImportWarning) => void

  constructor(onWarning?: (warning: ImportWarning) => void) {
    this.onWarning = onWarning
  }

  warn(code: string, message: string, elementName?: string): void {
    const warning: ImportWarning = { code, message, elementName }
    this.warnings.push(warning)
    this.onWarning?.(warning)
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[svg-import] ${code}: ${message}`)
    }
  }

  getAll(): ImportWarning[] {
    return this.warnings
  }
}
