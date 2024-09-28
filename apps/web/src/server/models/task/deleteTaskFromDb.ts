import { db } from '@/server/db/db'
import { tasks } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export function deleteTaskFromDb(taskId: string) {
  return db().delete(tasks).where(eq(tasks.id, taskId))
}
