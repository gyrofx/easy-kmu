import { FatalError } from '@/client/utils/FatalError'
import type { ServerInfo } from '@/common/serverInfo/ServerInfo'
import { type ReactElement, createContext, useContext } from 'react'

import { apiClient } from '@/client/api/client'
import { useAsync } from 'react-use'

export const ServerInfoContext = createContext(undefined as ServerInfo | undefined)

export function ServerInfoContextProvider({ children }: { children: ReactElement }) {
  const serverInfo = useAsync(apiClient.serverInfo)

  if (serverInfo.error) {
    return (
      <FatalError
        message={
          <>
            <p>An unexpected error has occurred. Please try reloading the app.</p>
            <p>ServerInfoContextProvider: Loading serverInfo failed</p>
          </>
        }
        error={{
          name: 'Failed to get server info',
          message: serverInfo.error.message,
        }}
      />
    )
  }
  if (serverInfo.value && serverInfo.value.status === 200) {
    return (
      <ServerInfoContext.Provider value={serverInfo.value.body}>{children}</ServerInfoContext.Provider>
    )
  }
  return null
}

export function useServerInfo() {
  const serverInfo = useContext(ServerInfoContext)

  if (!serverInfo) {
    throw new Error('server info not available. Make sure the ServerInfoProvider is used.')
  }

  return serverInfo
}
