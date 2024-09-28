import { apiClient } from '@/client/api/client'
import type { Task } from '@/common/models/task'
import { HttpError } from '@easy-kmu/common'

export async function tasksByProjectId(projectId: string): Promise<Task[]> {
  const response = await apiClient.listTasks({ query: { projectId } })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read tasks', response.status)
}
