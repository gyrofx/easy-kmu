import { useQuery } from 'react-query'
import { apiClient } from '@/client/api/client'
import { HttpError, IsoDateString } from '@easy-kmu/common'

export function useSpecialDaysQuery(from: Date, to: Date) {
  return useQuery({ queryKey: ['specialDays', from, to], queryFn: () => listSpecialDays(from, to) })
}

export async function listSpecialDays(from: Date, to: Date) {
  const response = await apiClient.specialDays({
    query: { from: IsoDateString(from), to: IsoDateString(to) },
  })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
