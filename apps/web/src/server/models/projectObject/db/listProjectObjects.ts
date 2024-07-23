import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { db } from '@/server/db/db'
import type { ProjectObject } from '@/common/models/projectObject'

export async function listProjectObjects(): Promise<ProjectObject[]> {
  return (await db().query.projectObjects.findMany()).map(nullsToUndefined)
}
