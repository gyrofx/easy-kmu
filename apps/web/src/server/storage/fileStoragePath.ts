import { opts } from '@/server/config/opts'
import { truthy } from '@easy-kmu/common'
import { join } from 'node:path'

export function fileStoragePath(projectId: string | undefined, filename: string) {
  const relativePath = join(...[projectId, filename].filter(truthy))
  const absolutePath = join(opts().fileStorage.path, relativePath)
  return { absolutePath, relativePath }
}

export type Storage = 'task'
