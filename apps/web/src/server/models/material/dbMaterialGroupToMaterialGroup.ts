import { IsoDateString } from '@easy-kmu/common'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import type { MaterialGroup } from '@/common/models/material'
import type { SelectMaterialGroup } from '@/server/db/schema/materials'

export function dbMaterialGroupToMaterialGroup(dbGroup: SelectMaterialGroup): MaterialGroup {
  return nullsToUndefined({
    ...dbGroup,
    createdAt: IsoDateString(dbGroup.createdAt),
    updatedAt: IsoDateString(dbGroup.updatedAt),
  })
}
