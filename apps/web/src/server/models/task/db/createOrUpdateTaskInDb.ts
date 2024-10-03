import type { CreateOrUpdateTask } from '@/common/models/task'
import { db } from '@/server/db/db'
import { tasks } from '@/server/db/schema'
import { dbTaskToTask } from '@/server/models/task/db/listTasks'
import { eq } from 'drizzle-orm'

export async function createOrUpdateTaskInDb(task: CreateOrUpdateTask) {
  const newTask = task.id
    ? await db().update(tasks).set(toDbTask(task)).where(eq(tasks.id, task.id)).returning()
    : await db().insert(tasks).values(toDbTask(task)).returning()

  if (!newTask[0]) throw new Error('No id returned from insert or update')

  return dbTaskToTask(newTask[0])
}

function toDbTask(task: CreateOrUpdateTask) {
  return { ...task, cardFileId: task.cardFileId ? task.cardFileId : null }
}
