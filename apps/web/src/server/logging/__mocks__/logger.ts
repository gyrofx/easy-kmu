let internalLogger: any = undefined

export function logger() {
  if (!internalLogger) throw new Error('Mock logger not initialized')
  return internalLogger
}

export function initLogger(_productionLogger: boolean) {
  internalLogger = {
    debug(_message: string, _meta: Record<string, any> | undefined) {},
    info(_message: string, _meta: Record<string, any> | undefined) {},
    warn(_message: string, _meta: Record<string, any> | undefined) {},
    error(_message: string, _meta: Record<string, any> | undefined) {},
  }
}
