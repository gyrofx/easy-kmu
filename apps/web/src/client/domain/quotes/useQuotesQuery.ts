import { useQuery } from 'react-query'
import { listQuotesByProject } from './listQuotesByProject'

export function useQuotesQuery(projectId: string) {
  return useQuery({ queryKey: ['quotes', projectId], queryFn: () => listQuotesByProject(projectId) })
}
