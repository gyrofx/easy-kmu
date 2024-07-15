import type { ClientOpts } from '@/common/config/ClientOpts'
import { opts } from '@/server/config/opts'

export function clientOpts(): ClientOpts {
  return { isDevelopment: opts().isDevelopment }
}
