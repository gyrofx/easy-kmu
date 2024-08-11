import { apiClient } from '@/client/api/client'
import { HttpError } from '@easy-kmu/common'

export async function quoteById(quoteId: string) {
  const response = await apiClient.quoteById({ query: { quoteId } })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
