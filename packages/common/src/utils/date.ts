import { isValid, parseISO } from 'date-fns'
import type { Nominal } from 'nominal'
import { zodISODateString } from 'utils/zodHelper'
import { zodParse } from 'utils/zodParse'
import { z } from 'zod'

export function timeZoneExists(timeZone: string) {
  if (!timeZone) return false

  try {
    Intl.DateTimeFormat(undefined, { timeZone })
    return true
  } catch {
    return false
  }
}

export type IsoDateString = Nominal<string, 'IsoDateString'>

export function IsoDateString(dateOrString: string | Date): IsoDateString {
  if (typeof dateOrString === 'string') {
    return zodParse(zodISODateString(), dateOrString) as IsoDateString
  }
  return dateOrString.toISOString() as IsoDateString
}

function isIsoDateString(isoDateString: string): isoDateString is IsoDateString {
  return isValid(parseISO(isoDateString))
}

export const zodIsoDateString = z.string().refine(isIsoDateString)
