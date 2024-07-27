import type { CreateOrUpdateObject } from '@/common/models/projectObject'
import { db } from '@/server/db/db'
import { projectObjects } from '@/server/db/schema'
import { dbObjectToObject } from '@/server/models/projectObject/db/listProjectObjects'
import { eq } from 'drizzle-orm'

export async function createOrUpdateObject(obj: CreateOrUpdateObject) {
  const newObject = obj.id
    ? await db().update(projectObjects).set(obj).where(eq(projectObjects.id, obj.id)).returning()
    : await db().insert(projectObjects).values(obj).returning()

  if (!newObject[0]) throw new Error('No id returned from insert or update')

  return dbObjectToObject(newObject[0])
}
