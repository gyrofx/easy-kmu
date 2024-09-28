import { db } from '@/server/db/db'
import { materials } from '@/server/db/schema'

export async function deleteAllMaterials() {
  await db().delete(materials)
}
