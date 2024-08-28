import { db } from '@/server/db/db'
import { projects } from '@/server/db/schema'
import type { CreateOrUpdateProject } from '@/common/models/project'
import { eq } from 'drizzle-orm'
import { findFirstProject } from '@/server/models/project/db/findFirstProject'

export async function createOrUpdateProject(project: CreateOrUpdateProject) {
  const ids = project.id
    ? await db()
        .update(projects)
        .set(project)
        .where(eq(projects.id, project.id))
        .returning({ id: projects.id })
    : await db().insert(projects).values(project).returning({ id: projects.id })

  const id = ids[0]?.id
  if (!id) throw new Error('No id returned from insert or update')
  return findFirstProject(id)
}
