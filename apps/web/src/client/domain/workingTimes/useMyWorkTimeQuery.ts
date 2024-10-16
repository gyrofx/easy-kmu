import { useQuery } from 'react-query'
import { apiClient } from '@/client/api/client'
import { HttpError, IsoDateString } from '@easy-kmu/common'

export function useMyWorkTimeQuery(from: Date, to: Date) {
  return useQuery({ queryKey: ['myWorkTime', from, to], queryFn: () => listMyWorkingTime(from, to) })
}

export async function listMyWorkingTime(from: Date, to: Date) {
  const response = await apiClient.listMyWorkTimes({
    query: { from: IsoDateString(from), to: IsoDateString(to) },
  })
  if (response.status === 200) return response.body
  throw new HttpError('Failed to read contacts', response.status)
}
