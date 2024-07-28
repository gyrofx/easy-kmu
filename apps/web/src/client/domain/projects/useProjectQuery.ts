import { projectById } from '@/client/domain/projects/projectById'
import { useQuery } from 'react-query'

export function useProjectQuery(projectId: string) {
  return useQuery({ queryKey: ['project', projectId], queryFn: () => projectById(projectId) })
}
