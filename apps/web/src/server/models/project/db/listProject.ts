import { db } from '@/server/db/db'
import type { Project } from '@/common/models/project'
import { IsoDateString } from '@easy-kmu/common'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { dbContactToConact } from '@/server/models/contact/db/listContacts'
import { dbEmployeeToEmployee } from '@/server/models/employee/db/listEmployees'

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
    customer: dbProject.customer ? dbContactToConact(dbProject.customer) : undefined,
    constructionManagement: dbProject.constructionManagement
      ? dbContactToConact(dbProject.constructionManagement)
      : undefined,
    architect: dbProject.architect ? dbContactToConact(dbProject.architect) : undefined,
    builder: dbProject.builder ? dbContactToConact(dbProject.builder) : undefined,
    clerk: dbProject.clerk ? dbEmployeeToEmployee(dbProject.clerk) : undefined,

    deadline: dbProject.deadline ? IsoDateString(dbProject.deadline) : undefined,
    createdAt: IsoDateString(dbProject.createdAt),
    updatedAt: IsoDateString(dbProject.updatedAt),
  })
}
