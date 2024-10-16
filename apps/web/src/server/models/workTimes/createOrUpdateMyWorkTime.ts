import type { CreateOrUpdateWorkingTimeEntry, WorkingTimeEntry } from '@/common/models/workingTime'
import { createOrUpdateMyWorkTimeInDb } from '@/server/models/workTimes/db/createOrUpdateMyWorkTimeInDb'

export function createOrUpdateMyWorkTime(
  workingTime: CreateOrUpdateWorkingTimeEntry,
  userId: string,
): Promise<WorkingTimeEntry> {
  return createOrUpdateMyWorkTimeInDb(workingTime, userId)
}
