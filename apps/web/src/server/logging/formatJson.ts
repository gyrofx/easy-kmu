import { isEmpty } from 'lodash'
import type { LogEntry } from './logger'

export function formatJson(logEntry: LogEntry) {
  const { level, timestamp, details, id, message } = logEntry
  return JSON.stringify({ timestamp, level, id, message, ...(isEmpty(details) ? {} : { details }) })
}
