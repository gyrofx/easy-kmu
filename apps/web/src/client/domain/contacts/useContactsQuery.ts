import { listContacts } from '@/client/domain/contacts/listContacts'
import { useQuery } from 'react-query'

export function useContactsQuery() {
  return useQuery({ queryKey: ['contacts'], queryFn: listContacts })
}
