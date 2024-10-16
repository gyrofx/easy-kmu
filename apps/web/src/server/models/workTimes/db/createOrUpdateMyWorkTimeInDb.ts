import type { CreateOrUpdateWorkingTimeEntry, WorkingTimeEntry } from '@/common/models/workingTime'
import { db } from '@/server/db/db'
import { eq } from 'drizzle-orm'
import { workingTimeEntry } from '@/server/db/schema/workingTimes'
import { toTs } from '@/server/models/workTimes/db/toTs'

export async function createOrUpdateMyWorkTimeInDb(
  workingTime: CreateOrUpdateWorkingTimeEntry,
  userId: string,
): Promise<WorkingTimeEntry> {
  const newWorkingTime = workingTime.id
    ? await db()
        .update(workingTimeEntry)
        .set(toDb(workingTime, userId))
        .where(eq(workingTimeEntry.id, workingTime.id))
        .returning()
    : await db().insert(workingTimeEntry).values(toDb(workingTime, userId)).returning()

  if (!newWorkingTime[0]) throw new Error('No id returned from insert or update')

  return toTs(newWorkingTime[0])
}

function toDb(obj: CreateOrUpdateWorkingTimeEntry, userId: string) {
  return { ...obj, taskId: obj.taskId ?? null, userId }
}
