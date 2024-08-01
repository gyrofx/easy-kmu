import { apiClient } from '@/client/api/client'
import { HttpError } from '@easy-kmu/common'

export async function listQuotesByProject(projectId: string) {
  const response = await apiClient.listQuotesByProject({ query: { projectId } })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
