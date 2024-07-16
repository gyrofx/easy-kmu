import { z } from 'zod'
// must be a relative path or it won't work once built into d.ts files.
import type { Unpack } from './tsc'

export interface FrontendLogEvent {
  level: LogLevel
  meta: ClientLogEventMetadata
  message?: LogMessagePart
  // these strings can be simple strings or serialized objects.
  // they can't be actual objects as elastic search doesn't support arrays with varying types.
  messages: string[]
}

export type ClientLogEventMetadata = z.infer<typeof clientLogEventMetadataSchema>
export const clientLogEventMetadataSchema = z.object({ createdAt: z.string() })

export type LogLevel = Unpack<typeof logLevels>
export const logLevels = ['trace', 'debug', 'info', 'log', 'warn', 'error'] as const
export type LogMessagePart = string | number | boolean | Record<string, any>
