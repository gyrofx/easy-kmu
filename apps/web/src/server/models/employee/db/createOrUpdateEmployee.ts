import type { CreateOrupdateEmployee } from '@/common/models/employee'
import { db } from '@/server/db/db'
import { employees } from '@/server/db/schema/employees'
import { dbEmployeeToEmployee } from '@/server/models/employee/db/listEmployees'
import { eq } from 'drizzle-orm'

export async function createOrUpdateEmployee(employee: CreateOrupdateEmployee) {
  const newEmployee = employee.id
    ? await db().update(employees).set(employee).where(eq(employees.id, employee.id)).returning()
    : await db().insert(employees).values(employee).returning()

  if (!newEmployee[0]) throw new Error('No id returned from insert or update')

  return dbEmployeeToEmployee(newEmployee[0])
}
