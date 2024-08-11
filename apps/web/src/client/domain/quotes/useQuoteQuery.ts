import { useQuery } from 'react-query'
import { quoteById } from '@/client/domain/quotes/quoteById'

export function useQuoteQuery(quoteId: string) {
  return useQuery({ queryKey: ['quote', quoteId], queryFn: () => quoteById(quoteId) })
}
