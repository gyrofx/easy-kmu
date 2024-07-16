import { parseISO } from 'date-fns'
import { z } from 'zod'
import { makeArray } from './array'

export function forceArray<T extends z.ZodTypeAny>(schema: T) {
  return z.union([z.array(schema), schema]).transform<z.infer<T>[]>(makeArray)
}

export function zodOptionalISODateStringToDate() {
  return zodOptionalISODateString().transform((s) => s && parseISO(s))
}

export function zodOptionalISODateString() {
  return z.string().optional().refine(undefinedOrValidISODate, { message: 'Invalid ISO date' })
}

export function zodISODateStringToDate() {
  return zodISODateString().transform((s) => parseISO(s))
}

export function zodISODateString() {
  return z.string().refine(validISODate, { message: 'Invalid ISO date' })
}

function undefinedOrValidISODate(s: string | undefined): boolean {
  return !s || validISODate(s)
}

function validISODate(date: string) {
  return !Number.isNaN(parseISO(date).getTime())
}
