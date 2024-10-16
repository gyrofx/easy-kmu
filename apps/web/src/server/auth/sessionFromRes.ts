import type { Res } from '@/common/api/reqres'
import { sessionSchema } from '@/common/models/user'
import type { Session } from '@auth/express'

export function sessionFromRes(res: Res): Session | undefined {
  return sessionSchema.safeParse(res.locals.session).data
}
