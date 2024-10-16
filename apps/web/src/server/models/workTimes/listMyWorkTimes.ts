import type { WorkingTimeEntry } from '@/common/models/workingTime'
import { findWorkTimesFromDb } from '@/server/models/workTimes/db/findWorkTimesFromDb '
import type { IsoDateString } from '@easy-kmu/common'

export function listMyWorkTimes(
  query: { from: IsoDateString; to: IsoDateString },
  userId: string,
): Promise<WorkingTimeEntry[]> {
  return findWorkTimesFromDb(query, userId)
}
