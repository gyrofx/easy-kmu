import { listProjects } from '@/client/domain/projects/listProjects'
import { useQuery } from 'react-query'

export function useProjectsQuery() {
  return useQuery({ queryKey: ['projects'], queryFn: listProjects })
}
