import { listEmployees } from '@/client/domain/employee/listEmployees'
import { useQuery } from 'react-query'

export function useEmployeesQuery() {
  return useQuery({ queryKey: ['employees'], queryFn: listEmployees })
}
