import { opts } from '@/server/config/opts'
import { unlink } from 'node:fs/promises'
import { join } from 'node:path'
import { deleteFileFromDb } from './db/deleteFileFromDb'
import type { File } from '@/common/models/file'

export async function deleteFile(file: File) {
  await deleteFileFromDb(file.id)

  const absolutePath = join(opts().fileStorage.path, file.path)
  await unlink(absolutePath)
}
