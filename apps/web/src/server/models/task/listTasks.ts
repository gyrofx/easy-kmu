import type { Task } from '@/common/models/task'
import { db } from '@/server/db/db'
import { tasks } from '@/server/db/schema'
import { IsoDateString } from '@easy-kmu/common'
import { eq } from 'drizzle-orm'

export async function listTasks(projectId: string): Promise<Task[]> {
  const tasks = await listTasksInner(projectId)
  return tasks.map(dbTaskToTask)
}

async function listTasksInner(projectId: string) {
  return await db().query.tasks.findMany({ where: eq(tasks.projectId, projectId) })
}

export function dbTaskToTask(dbTask: Awaited<ReturnType<typeof listTasksInner>>[number]): Task {
  return {
    ...dbTask,
    createdAt: IsoDateString(dbTask.createdAt),
    updatedAt: IsoDateString(dbTask.updatedAt),
  }
}
