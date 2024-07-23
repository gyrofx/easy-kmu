import type { Employee } from '@/common/models/employee'
import { db } from '@/server/db/db'
import { IsoDateString } from '@easy-kmu/common'

export async function listEmployees(): Promise<Employee[]> {
  const employees = await listEmployeesInner()
  return employees.map(dbEmployeeToEmployee)
}

async function listEmployeesInner() {
  return await db().query.employees.findMany()
}

export function dbEmployeeToEmployee(
  dbEmployee: Awaited<ReturnType<typeof listEmployeesInner>>[number],
): Employee {
  return {
    ...dbEmployee,
    createdAt: IsoDateString(dbEmployee.createdAt),
    updatedAt: IsoDateString(dbEmployee.updatedAt),
  }
}
