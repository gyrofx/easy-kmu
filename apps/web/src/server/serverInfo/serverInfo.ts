import type { ServerInfo } from '@/common/serverInfo/ServerInfo'
import { clientOpts } from '@/server/config/clientOpts'

export function serverInfo(): ServerInfo {
  return { opts: clientOpts() }
}
