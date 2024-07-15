import { get } from '@/client/utils/fetch'
import { ServerInfo } from '@/common/serverInfo/ServerInfo'

export async function loadServerInfo() {
  return Object.freeze(await get<ServerInfo>('/api/server-info'))
}
