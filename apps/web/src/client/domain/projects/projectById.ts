import { apiClient } from '@/client/api/client'
import { HttpError, IsoDateString } from '@easy-kmu/common'
import type { Project } from '@/common/models/project'

export async function projectById(projectId: string): Promise<Project> {
  const response = await apiClient.projectById({ params: { id: projectId } })
  if (response.status !== 200) throw new HttpError('Failed to read contacts', response.status)
  return {
    ...response.body,
    deadline: response.body.deadline ? IsoDateString(response.body.deadline) : undefined,
  }
}
