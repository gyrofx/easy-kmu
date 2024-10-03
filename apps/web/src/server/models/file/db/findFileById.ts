import { db } from '@/server/db/db'
import { dbFileToFile } from '@/server/models/file/db/dbFileToFile'

export async function findFileById(id: string) {
  const file = await findFileByIdInner(id)
  if (!file) return undefined

  return dbFileToFile(file)
}

function findFileByIdInner(id: string) {
  return db().query.files.findFirst({
    where: (files, { eq }) => eq(files.id, id),
  })
}
