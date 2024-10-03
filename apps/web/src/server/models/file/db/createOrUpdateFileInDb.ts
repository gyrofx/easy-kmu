import type { CreateOrUpdateFile } from '@/common/models/file'
import { db } from '@/server/db/db'
import { files, tasks } from '@/server/db/schema'
import { dbFileToFile } from '@/server/models/file/db/dbFileToFile'
import { eq } from 'drizzle-orm'

export async function createOrUpdateFileInDb(file: CreateOrUpdateFile) {
  const newFile = file.id
    ? await db().update(tasks).set(file).where(eq(files.id, file.id)).returning()
    : await db().insert(files).values(file).returning()

  if (!newFile[0]) throw new Error('No id returned from insert or update')

  return dbFileToFile(newFile[0])
}
