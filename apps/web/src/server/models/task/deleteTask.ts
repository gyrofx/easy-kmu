import { findTaskByIdInDb } from '@/server/models/task/db/findTaskByIdInDb'
import { deleteTaskFromDb } from './db/deleteTaskFromDb'
import { deleteFile } from '@/server/models/file/deleteFile'

export async function deleteTask(taskId: string) {
  const task = await findTaskByIdInDb(taskId)
  if (!task) throw new Error('task not found')

  if (task.cardFile) await deleteFile(task.cardFile)

  await deleteTaskFromDb(taskId)
}
