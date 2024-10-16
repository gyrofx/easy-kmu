import type { Req, Res } from '@/common/api/reqres'
import { hasPermission, isRoleId, type RoleId, type Permission } from '@/common/userAuth/Role'
import { sessionFromRes } from '@/server/auth/sessionFromRes'
import { logger } from '@/server/logging/logger'
import type { Response } from 'express'

export function isAuthenticatedReq(res: Res) {
  return !!(res as any).locals.session
}

/**
 * If this middleware passes, `Req` is guaranteed to be an `AuthenticatedReq`
 */
export function ensureAuthenticated(req: Req<any, any, any, any>, res: Response, next: () => void) {
  if (isAuthenticatedReq(res)) {
    next()
  } else {
    logger().error('Unauthenticated request', { ip: req.ip })
    res.sendStatus(401)
  }
}

/**
 * If this middleware passes, the user has the selected role with the given permission
 * `Req` is guaranteed to be an `AuthenticatedReq`
 */
export function ensureHasPermission(permission: Permission) {
  return (req: Req<any, any, any, any>, res: Response, next: () => void) => {
    const roleIds = roleFromRes(res)
    if (isAuthenticatedReq(res) && hasPermission(roleIds, permission)) {
      next()
    } else {
      const { id, role } = sessionFromRes(res)?.user ?? { id: 'unknown', role: 'unknown' }
      const details = { id, permission, role, ip: req.ip }
      logger().error("Unauthorized request. User doesn't have a necessary permission", details)
      res.sendStatus(403)
    }
  }
}

function roleFromRes(res: Res): RoleId[] {
  const role = sessionFromRes(res)?.user?.role || undefined
  if (isRoleId(role)) return [role]
  return []
}
