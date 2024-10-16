import type { SpecialDay } from '@/common/models/workingTime'
import { findSpecialDaysFromDb } from '@/server/models/workTimes/db/findSpecialDaysFromDb'
import type { IsoDateString } from '@easy-kmu/common'

export function specialDays(query: { from: IsoDateString; to: IsoDateString }): Promise<SpecialDay[]> {
  return findSpecialDaysFromDb(query)
}
