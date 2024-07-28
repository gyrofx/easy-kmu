import { apiClient } from '@/client/api/client'
import { HttpError } from '@easy-kmu/common'
import type { Project } from '@/common/models/project'

export async function projectById(projectId: string): Promise<Project> {
  const response = await apiClient.projectById({ params: { id: projectId } })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
