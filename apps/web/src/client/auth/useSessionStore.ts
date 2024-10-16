import { z } from 'zod'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface SessionState {
  session: Session | undefined
  setSession: (session: Session) => void
  clearSession: () => void
  signIn: () => void
  signOut: () => void
}

export interface Session {
  userId: string
  expires: Date
  user: {
    name: string
    email: string
    image: string
    role: string
  }
}

export const zodSession = z.object({
  userId: z.string(),
  expires: z.coerce.date(),
  user: z.object({
    name: z.string(),
    email: z.string(),
    image: z.string(),
    role: z.string(),
  }),
})

export const useSessionStore = create(
  persist<SessionState>(
    (set) => ({
      session: undefined,
      setSession: (session: Session) => set((state) => ({ ...state, session })),
      clearSession: () => set((state) => ({ ...state, session: undefined })),
      signIn: () => {
        window.location.href = '/auth/signin'
      },
      signOut: () => {
        set((state) => ({ ...state, session: undefined }))
        window.location.href = '/auth/signout'
      },
    }),
    {
      name: 'session-store',
      // storage: createJSONStorage(() => localStorage),
    },
  ),
)
