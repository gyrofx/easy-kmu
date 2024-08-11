import { db } from '@/server/db/db'
import type { Project } from '@/common/models/project'
import { IsoDateString } from '@easy-kmu/common'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { dbContactToConact } from '@/server/models/contact/db/listContacts'
import { dbEmployeeToEmployee } from '@/server/models/employee/db/listEmployees'
import { dbObjectToObject } from '@/server/models/projectObject/db/listProjectObjects'

export async function listProjects(): Promise<Project[]> {
  const projects = await listProjectInner()
  return projects.map(dbProjectToProject)
}

async function listProjectInner() {
  return await db().query.projects.findMany({
    with: {
      customer: true,
      object: true,
      constructionManagement: true,
      architect: true,
      builder: true,
      clerk: true,
    },
  })
}

export function dbProjectToProject(
  dbProject: Awaited<ReturnType<typeof listProjectInner>>[number],
): Project {
  return nullsToUndefined({
    ...dbProject,
    projectNumber: dbProject.projectNumber.toString(),
    object: dbProject.object ? dbObjectToObject(dbProject.object) : undefined,
    customer: dbProject.customer ? dbContactToConact(dbProject.customer) : undefined,
    customerPersonsInCharge: [],
    constructionManagement: dbProject.constructionManagement
      ? dbContactToConact(dbProject.constructionManagement)
      : undefined,
    constructionManagementPersonsInCharge: [],
    architect: dbProject.architect ? dbContactToConact(dbProject.architect) : undefined,
    architectPersonsInCharge: [],
    builder: dbProject.builder ? dbContactToConact(dbProject.builder) : undefined,
    builderPersonsInCharge: [],
    clerk: dbEmployeeToEmployee(dbProject.clerk),

    deadline: dbProject.deadline ? IsoDateString(dbProject.deadline) : undefined,
    createdAt: IsoDateString(dbProject.createdAt),
    updatedAt: IsoDateString(dbProject.updatedAt),
  })
}
