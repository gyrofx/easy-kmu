import type { Task } from '@/common/models/task'
import { createFile } from '@/server/models/file/createOrUpdateFile'
import { deleteFile } from '@/server/models/file/deleteFile'
import { createOrUpdateTaskInDb } from '@/server/models/task/db/createOrUpdateTaskInDb'

export async function createOrUpdateTaskCardFile(task: Task, blob: Blob) {
  const { projectId } = task
  const filename = `taskCard-${task.id}.pdf`
  const mimeType = 'application/pdf'
  if (task.cardFile) await deleteFile(task.cardFile)
  const { id: cardFileId } = await createFile({ projectId, filename, mimeType, blob })
  console.log('createOrUpdateTaskCardFile', { task })
  const { updatedAt, createdAt, ...rest } = task
  const newTask = await createOrUpdateTaskInDb({ ...rest, cardFileId })

  return newTask
}
