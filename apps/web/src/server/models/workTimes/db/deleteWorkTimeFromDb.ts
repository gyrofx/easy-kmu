import { db } from '@/server/db/db'
import { workingTimeEntry } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export function deleteWorkTimeFromDb(workTimeId: string) {
  return db().delete(workingTimeEntry).where(eq(workingTimeEntry.id, workTimeId))
}
