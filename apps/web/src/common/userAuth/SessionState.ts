import type { SessionData } from '@/common/userAuth/SessionData'

export interface SessionState {
  signedIn: boolean
  data?: SessionData
}

export interface AuthenticatedSession {
  signedIn: true
  data: SessionData
}

export function isAuthenticatedSession(session: SessionState): session is AuthenticatedSession {
  return session.signedIn && !!session.data
}
