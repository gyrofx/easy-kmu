import { apiClient } from '@/client/api/client'
import { HttpError } from '@easy-kmu/common'

export async function listObjects() {
  const response = await apiClient.listProjectObjects()
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
