import { db } from '@/server/db/db'
import { dbMaterialGroupToMaterialGroup } from '@/server/models/material/dbMaterialGroupToMaterialGroup'

export async function listMaterialGroup() {
  const materials = await listMaterialGroupInner()
  return materials.map(dbMaterialGroupToMaterialGroup)
}

async function listMaterialGroupInner() {
  return await db().query.materialGroups.findMany()
}
