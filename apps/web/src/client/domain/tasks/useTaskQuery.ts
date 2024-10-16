import { useQuery } from 'react-query'
import { tasksByProjectId } from './tasksByProjectId'
import { apiClient } from '@/client/api/client'
import { HttpError } from '@easy-kmu/common'
import type { Task } from '@/common/models/task'

export function useTaskQuery(projectId: string) {
  return useQuery({ queryKey: ['tasks', projectId], queryFn: () => tasksByProjectId(projectId) })
}

export function useOpenTaskQuery() {
  return useQuery({ queryKey: ['open-tasks'], queryFn: () => openTasks() })
}

export async function openTasks(): Promise<Task[]> {
  const response = await apiClient.listTasks({ query: { state: 'todo' } })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read tasks', response.status)
}
