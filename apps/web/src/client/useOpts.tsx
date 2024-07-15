import { useServerInfo } from '@/client/serverInfo/useServerInfo'

export function useOpts() {
  return useServerInfo().opts
}
