import { db } from '@/server/db/db'
import { dbProjectToProject } from '@/server/models/project/db/listProject'

export async function findFirstProject(id: string) {
  const newOrUpdateProject = await findFirstProjectInner(id)
  if (!newOrUpdateProject) return undefined

  return dbProjectToProject(newOrUpdateProject)
}

function findFirstProjectInner(id: string) {
  return db().query.projects.findFirst({
    where: (projects, { eq }) => eq(projects.id, id),
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
