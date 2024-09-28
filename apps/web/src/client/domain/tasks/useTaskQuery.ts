import { useQuery } from 'react-query'
import { tasksByProjectId } from './tasksByProjectId'

export function useTaskQuery(projectId: string) {
  return useQuery({ queryKey: ['tasks', projectId], queryFn: () => tasksByProjectId(projectId) })
}
