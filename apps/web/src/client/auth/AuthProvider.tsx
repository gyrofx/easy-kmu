import { SignIn } from '@/client/auth/SignIn'
import { type Session, useSessionStore, zodSession } from '@/client/auth/useSessionStore'
import { zodParse } from '@easy-kmu/common'
import { LinearProgress } from '@mui/material'
import { type ReactNode, createContext } from 'react'
import { useQuery } from 'react-query'
// import { useAsync } from 'react-use'

export const SessionContext = createContext(undefined as any | undefined)

export function AuthProvider(props: { children: ReactNode }) {
  const { children } = props
  const { session, setSession, clearSession } = useSessionStore()

  const { isLoading } = useQuery('session', getSession, {
    onSuccess: (data) => {
      if (data) setSession(data)
      else clearSession()
    },
    onError: () => {
      console.log('on error')
      clearSession()
    },
  })

  if (session) return children
  if (isLoading) return <LinearProgress />
  return <SignIn />
}

async function getSession(): Promise<Session | undefined> {
  const response = await fetch('/auth/session')
  if (response.ok) {
    const data = await response.json()
    console.log('data', data)
    return zodSession.safeParse(data).data
  }
  return undefined
}
