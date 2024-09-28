import { db } from '@/server/db/db'
import { dbMaterialToMaterial } from '@/server/models/material/dbMaterialToMaterial'

export async function listMaterial() {
  const materials = await listMaterialInner()
  return materials.map(dbMaterialToMaterial)
}

async function listMaterialInner() {
  return await db().query.materials.findMany()
}
