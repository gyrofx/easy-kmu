import { IsoDateString } from '@easy-kmu/common'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import type { Material } from '@/common/models/material'
import type { SelectMaterial } from '@/server/db/schema/materials'

export function dbMaterialToMaterial(material: SelectMaterial): Material {
  return nullsToUndefined({
    ...material,
    createdAt: IsoDateString(material.createdAt),
    updatedAt: IsoDateString(material.updatedAt),
  })
}
