import type { SelectFile } from '@/server/db/schema/files'
import { IsoDateString } from '@easy-kmu/common'

export function dbFileToFile(dbFile: SelectFile) {
  return {
    ...dbFile,
    createdAt: IsoDateString(dbFile.createdAt),
    updatedAt: IsoDateString(dbFile.updatedAt),
  }
}
