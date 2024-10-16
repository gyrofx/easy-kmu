import type { WorkingTimeEntry } from '@/common/models/workingTime'
import type { SelectWorkingTimeOfUser } from '@/server/db/schema/workingTimes'
import { IsoDateString } from '@easy-kmu/common'

export function toTs(dbObject: SelectWorkingTimeOfUser): WorkingTimeEntry {
  return {
    ...dbObject,
    day: IsoDateString(dbObject.day),
    taskId: dbObject.taskId ?? undefined,
    comment: dbObject.comment ?? '',
    createdAt: IsoDateString(dbObject.createdAt),
    updatedAt: IsoDateString(dbObject.updatedAt),
  }
}
