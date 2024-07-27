import { listObjects } from '@/client/domain/projectObjects/listObjects'
import { useQuery } from 'react-query'

export function useQbjectsQuery() {
  return useQuery({ queryKey: ['objects'], queryFn: listObjects })
}
