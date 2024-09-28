import { db } from '@/server/db/db'
import { materialGroups } from '@/server/db/schema'

export async function deleteAllMaterialGroups() {
  await db().delete(materialGroups)
}
