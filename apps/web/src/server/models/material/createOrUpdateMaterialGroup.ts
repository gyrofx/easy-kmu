import { db } from '@/server/db/db'
import { eq } from 'drizzle-orm'
import type { CreateOrUpdateMaterialGroup } from '@/common/models/material'
import { materialGroups } from '@/server/db/schema'
import { dbMaterialGroupToMaterialGroup } from '@/server/models/material/dbMaterialGroupToMaterialGroup'

export async function createOrUpdateMaterialGroup(group: CreateOrUpdateMaterialGroup) {
  const returning = group.id
    ? await db().update(materialGroups).set(group).where(eq(materialGroups.id, group.id)).returning()
    : await db().insert(materialGroups).values(group).returning()

  const updated = returning[0]
  if (!updated) throw new Error('No contact returned from insert or update')

  return dbMaterialGroupToMaterialGroup(updated)
}
