import { db } from '@/server/db/db'
import type { Project } from '@/common/models/project'
import { dbProjectToProject } from '@/server/models/project/db/dbProjectToProject'

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
      projectManager: true,
    },
  })
}
