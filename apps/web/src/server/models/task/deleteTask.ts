import { deleteTaskFromDb } from './deleteTaskFromDb'

export async function deleteTask(taskId: string) {
  await deleteTaskFromDb(taskId)
}
