import type { Task, TaskStatus } from '@/common/models/task'
import { db } from '@/server/db/db'
import { tasks } from '@/server/db/schema'
import { dbFileToFile } from '@/server/models/file/db/dbFileToFile'
import { IsoDateString } from '@easy-kmu/common'
import { and, eq } from 'drizzle-orm'

export async function listTasks(query: { projectId?: string; state?: TaskStatus }): Promise<Task[]> {
  const tasks = await listTasksInner(query)
  return tasks.map(dbTaskToTask)
}

async function listTasksInner(query: { projectId?: string; state?: TaskStatus }) {
  const { projectId, state } = query
  return await db().query.tasks.findMany({
    where: and(
      projectId ? eq(tasks.projectId, projectId) : undefined,
      state ? eq(tasks.state, state) : undefined,
    ),

    with: { cardFile: true },
  })
}

export function dbTaskToTask(dbTask: Awaited<ReturnType<typeof listTasksInner>>[number]): Task {
  return {
    ...dbTask,
    cardFileId: dbTask.cardFileId ? dbTask.cardFileId : undefined,
    cardFile: dbTask.cardFile ? dbFileToFile(dbTask.cardFile) : undefined,
    createdAt: IsoDateString(dbTask.createdAt),
    updatedAt: IsoDateString(dbTask.updatedAt),
  }
}
