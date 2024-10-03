import type { Task } from '@/common/models/task'
import { deleteFile } from '@/server/models/file/deleteFile'
import { createOrUpdateTaskInDb } from '@/server/models/task/db/createOrUpdateTaskInDb'

export async function createOrUpdateTask(task: Task) {
  console.log('createOrUpdateTask', { task })

  const updatedTask = await createOrUpdateTaskInDb({ ...task, cardFileId: undefined })
  console.log('createOrUpdateTask', { updatedTask })
  if (task.cardFile) await deleteFile(task.cardFile)
  return updatedTask
}
