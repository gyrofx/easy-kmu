import { inspect } from 'node:util'
import { formatJson } from './formatJson'
import { formatPretty } from './formatPretty'
import { errorToPlainObject } from '@easy-kmu/common/src/utils/errors'

let internalLogger: ConfiguredLogger | undefined

export function initLogger(config: 'production' | 'development' | 'test' = 'production') {
  if (internalLogger) throw new Error('Logger already initialized')
  internalLogger =
    config === 'production'
      ? createProductionLogger()
      : config === 'test'
        ? createTestLogger()
        : createDevelopmentLogger()
}

export function uninitializeLogger() {
  internalLogger = undefined
}

export function logger(): Logger {
  if (!internalLogger) throw new Error('Logger not initialized')
  return internalLogger
}

export interface Logger {
  error: LogMethod
  warn: LogMethod
  info: LogMethod
  debug: LogMethod
}

function createProductionLogger(): ConfiguredLogger {
  return {
    error,
    warn,
    info,
    debug,
    formatter: formatJson,
    logLevels: defaultLogLevels(),
  }
}

function createDevelopmentLogger() {
  return { ...createProductionLogger(), formatter: formatPretty }
}

function createTestLogger() {
  return { ...createDevelopmentLogger(), logLevels: [] }
}

interface ConfiguredLogger extends Logger {
  formatter: Formatter
  logLevels: LogLevel[]
}

interface LogMethod {
  (id: string): void
  (id: string, details: DetailsOrError): void
  (id: string, details: DetailsOrError, idOverride: IdOverride): void
}

type Formatter = (logEntry: LogEntry) => string
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

function warn(
  id: string,
  detailsOrError: DetailsOrError = undefined,
  idOverride: IdOverride = undefined,
): void {
  log('warn', id, detailsOrError, idOverride)
}

function info(
  id: string,
  detailsOrError: DetailsOrError = undefined,
  idOverride: IdOverride = undefined,
): void {
  log('info', id, detailsOrError, idOverride)
}

function debug(
  id: string,
  detailsOrError: DetailsOrError = undefined,
  idOverride: IdOverride = undefined,
): void {
  log('debug', id, detailsOrError, idOverride)
}

function error(
  id: string,
  detailsOrError: DetailsOrError = undefined,
  idOverride: IdOverride = undefined,
): void {
  log('error', id, detailsOrError, idOverride)
}

function log(level: LogLevel, id: string, detailsOrError: DetailsOrError, idOverride: IdOverride): void {
  if (!internalLogger?.logLevels.includes(level)) return
  const timestamp = new Date()
  const details = detailsOrError instanceof Error ? errorToPlainObject(detailsOrError) : detailsOrError
  const message = formatMessage(id, idOverride || details)
  // eslint-disable-next-line no-console
  console.log(internalLogger.formatter({ level, id, message, timestamp, details }))
}

export interface LogEntry {
  level: LogLevel
  timestamp: Date
  id: string
  message: string
  details: Record<string, any> | undefined
}

function defaultLogLevels() {
  return ['debug', 'info', 'warn', 'error'] as LogLevel[]
}

type DetailsOrError = Record<string, any> | Error | undefined
type IdOverride = string | Record<string, any> | any[] | undefined

function formatMessage(id: string, idOverride: IdOverride) {
  if (!idOverride) return id
  if (typeof idOverride === 'string') return idOverride

  return `${id}: ${messageOverrideToString(idOverride)}`
}

function messageOverrideToString(data: Record<string, any> | any[]) {
  const stringified = inspect(data, { compact: true, breakLength: 1000000 })
  return stringified === '{}' || stringified === '[]' ? '' : stringified
}
