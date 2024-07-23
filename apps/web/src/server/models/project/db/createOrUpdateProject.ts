import { db } from '@/server/db/db'
import { projects } from '@/server/db/schema'
import type { CreateOrUpdateProject } from '@/common/models/project'
import { parseISO } from 'date-fns'
import { eq } from 'drizzle-orm'
import { findFirstProject } from '@/server/models/project/db/findFirstProject'

export async function createOrUpdateProject(project: CreateOrUpdateProject) {
  const deadline = project.deadline ? parseISO(project.deadline) : null
  const dbProject = { ...project, deadline }

  const ids = project.id
    ? await db()
        .update(projects)
        .set(dbProject)
        .where(eq(projects.id, project.id))
        .returning({ id: projects.id })
    : await db().insert(projects).values(dbProject).returning({ id: projects.id })

  const id = ids[0]?.id
  if (!id) throw new Error('No id returned from insert or update')
  return findFirstProject(id)
}
