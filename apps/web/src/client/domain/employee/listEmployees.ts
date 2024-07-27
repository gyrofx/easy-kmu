import { apiClient } from '@/client/api/client'
import { HttpError } from '@easy-kmu/common'

export async function listEmployees() {
  const response = await apiClient.listEmployees()
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
