import { db } from '@/server/db/db'
import { files } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export function deleteFileFromDb(fileId: string) {
  return db().delete(files).where(eq(files.id, fileId))
}
