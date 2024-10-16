import { t } from '@/common/i18n/t'
import type { Unpack } from '@easy-kmu/common'
import { uniq } from 'lodash'

export interface Role {
  id: RoleId
  displayName: () => string
  displayInitials: () => string
  permissions: Permission[]
}

export const roleIds = ['admin', 'editor', 'secretary', 'workTime', 'noRole'] as const
export type ExistingRoleId = RoleId
export type RoleId = Unpack<typeof roleIds>

const permissions = [
  'ManageProjects',
  'ReadProjects',
  'ManageMaterial',
  'ReadMaterial',
  'ReadAudit',
  'ManageWorkTime',
  'ManageMyWorkTime',
] as const
export type Permission = Unpack<typeof permissions>

export const roles: Record<RoleId, Role> = {
  admin: {
    id: 'admin',
    displayName: () => t().roles.admin.displayName,
    displayInitials: () => t().roles.admin.displayInitials,
    permissions: [
      'ManageProjects',
      'ReadProjects',
      'ManageMaterial',
      'ReadMaterial',
      'ReadAudit',
      'ManageWorkTime',
      'ManageMyWorkTime',
    ],
  },
  editor: {
    id: 'editor',
    displayName: () => t().roles.editor.displayName,
    displayInitials: () => t().roles.editor.displayInitials,
    permissions: ['ManageProjects', 'ReadProjects', 'ManageMaterial', 'ManageMyWorkTime'],
  },
  secretary: {
    id: 'secretary',
    displayName: () => t().roles.secretary.displayName,
    displayInitials: () => t().roles.secretary.displayInitials,
    permissions: [
      'ManageProjects',
      'ReadProjects',
      'ManageMaterial',
      'ReadMaterial',
      'ManageWorkTime',
      'ManageMyWorkTime',
    ],
  },
  workTime: {
    id: 'workTime',
    displayName: () => t().roles.workTime.displayName,
    displayInitials: () => t().roles.workTime.displayInitials,
    permissions: ['ManageMyWorkTime'],
  },
  noRole: {
    id: 'noRole',
    displayName: () => t().roles.noRole.displayName,
    displayInitials: () => t().roles.noRole.displayInitials,
    permissions: [],
  },
}

export function isExistingRoleId(name: string | undefined): name is ExistingRoleId {
  return isRoleId(name)
}

export function isRoleId(name: string | undefined): name is RoleId {
  return typeof name === 'string' && name in roles
}

export function hasPermission(currentRoleIds: RoleId[], permission: Permission): boolean {
  return currentRoleIds.some((roleId) => hasPermissionWithRole(roleId, permission))
}

export function allPermissions(currentRoleIds: RoleId[]): Permission[] {
  return uniq(currentRoleIds.flatMap((roleId) => roles[roleId].permissions))
}

function hasPermissionWithRole(role: RoleId, permission: Permission): boolean {
  return roles[role].permissions.includes(permission)
}
