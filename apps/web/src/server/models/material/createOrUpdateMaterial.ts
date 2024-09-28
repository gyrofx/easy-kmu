import { db } from '@/server/db/db'
import { eq } from 'drizzle-orm'
import type { CreateOrUpdateMaterial } from '@/common/models/material'
import { materials } from '@/server/db/schema'
import { dbMaterialToMaterial } from '@/server/models/material/dbMaterialToMaterial'

export async function createOrUpdateMaterial(material: CreateOrUpdateMaterial) {
  const returning = material.id
    ? await db().update(materials).set(material).where(eq(materials.id, material.id)).returning()
    : await db().insert(materials).values(material).returning()

  const updated = returning[0]
  if (!updated) throw new Error('No Material returned from insert or update')

  return dbMaterialToMaterial(updated)
}
