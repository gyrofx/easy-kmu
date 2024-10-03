import { db } from '@/server/db/db'
import { dbTaskToTask } from '@/server/models/task/db/listTasks'

export async function findTaskByIdInDb(taskId: string) {
  const task = await findTaskByIdInner(taskId)
  if (!task) return undefined

  return dbTaskToTask(task)
}

function findTaskByIdInner(id: string) {
  return db().query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, id),
    with: { cardFile: true },
  })
}
