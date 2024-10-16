import type { Res } from '@/common/api/reqres'
import { sessionFromRes } from './sessionFromRes'
import type { AdapterUser } from '@auth/core/adapters'

export function userFromRes(res: Res): AdapterUser {
  const user = sessionFromRes(res)?.user
  if (user) return user
  throw new Error('User not found')
}

export function userFromResOr401(res: Res): AdapterUser | { status: 401 } {
  const user = sessionFromRes(res)?.user
  if (user) return user
  return { status: 401 }
}
