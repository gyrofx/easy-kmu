import type { ClientOpts } from '@/common/config/ClientOpts'

export interface ServerInfo {
  version: string
  appShortVersion: string
  optsShortVersion: string
  opts: ClientOpts
}
