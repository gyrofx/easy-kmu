import { db } from '@/server/db/db'
import type { ProjectObject } from '@/common/models/projectObject'
import { IsoDateString } from '@easy-kmu/common'

export async function listProjectObjects(): Promise<ProjectObject[]> {
  const objects = await listObjectsInner()
  return objects.map(dbObjectToObject)
}

async function listObjectsInner() {
  return await db().query.projectObjects.findMany()
}

export function dbObjectToObject(
  dbObject: Awaited<ReturnType<typeof listObjectsInner>>[number],
): ProjectObject {
  return {
    ...dbObject,
    createdAt: IsoDateString(dbObject.createdAt),
    updatedAt: IsoDateString(dbObject.updatedAt),
  }
}
