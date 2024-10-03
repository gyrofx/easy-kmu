import { createOrUpdateFileInDb } from '@/server/models/file/db/createOrUpdateFileInDb'
import { fileStoragePath } from '@/server/storage/fileStoragePath'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function createFile(props: {
  filename: string
  projectId: string | undefined
  mimeType: string
  blob: Blob
}) {
  const { filename, projectId, mimeType, blob } = props
  const { absolutePath, relativePath } = fileStoragePath(projectId, filename)
  await mkdir(dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, Buffer.from(await blob.arrayBuffer()))

  return createOrUpdateFileInDb({ mimeType, path: relativePath })
}
