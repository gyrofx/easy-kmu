import { inspect } from 'node:util'
import { isEmpty } from 'lodash'
import type { LogEntry, LogLevel } from '@/server/logging/logger'

export function formatPretty(logEntry: LogEntry) {
  const { level, timestamp, details, id } = logEntry
  return `${formatTimestamp(timestamp)} ${formatLevel(level)} ${id}${formatDetails(details)}`
}

function formatTimestamp(timestamp: Date) {
  return styledString(timestamp.toISOString(), [colorFromInspect('gray')])
}

function formatLevel(level: LogLevel) {
  return styledString(level.toUpperCase().padEnd(7, ' '), levelStyle(level))
}

function formatDetails(details: Record<string, any> | undefined) {
  return isEmpty(details) ? '' : `\n${inspect(details, { colors: true, compact: false })}`
}

function levelStyle(level: LogLevel) {
  const styles = levelStyles[level]
  if (!styles) throw new Error(`Style for level ${level} not defined`)

  return styles
}

const levelStyles = {
  error: [colorFromInspect('bold'), colorFromInspect('red')],
  warn: [colorFromInspect('bold'), colorFromInspect('yellow')],
  info: [colorFromInspect('bold'), colorFromInspect('blue')],
  debug: [colorFromInspect('bold'), colorFromInspect('green')],
}

function colorFromInspect(style: string) {
  const color = inspect.colors[style]
  if (!color) throw new Error(`Style '${style}' not defined`)
  return color
}

function styledString(str: string, styles: [number, number][]) {
  return styles.reduce((acc, style) => {
    acc = `\u001b[${style[0]}m${acc}\u001b[${style[1]}m`
    return acc
  }, str)
}
