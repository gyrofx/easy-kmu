import { Login } from '@/client/auth/Login'
import { type ReactNode, createContext, useContext } from 'react'
// import { useAsync } from 'react-use'

export const SessionContext = createContext(undefined as any | undefined)

export function AuthProvider(props: { children: ReactNode }) {
  const { children } = props
  const session = { error: null, value: {} } // useAsync(clientVanilla['current-session'].query)

  if (session.error) {
    return <Login />
  }
  if (session.value) {
    return <SessionContext.Provider value={session.value}>{children}</SessionContext.Provider>
  }
  return null
}

export function useSession() {
  const session = useContext(SessionContext)
  return { session, isAuthenticated: !!session }
}
