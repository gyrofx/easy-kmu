import { z } from 'zod'
// import { isRoleId, RoleId } from 'common/userAuth/Role'

/**
 * This is the session data provided to the client by the server.
 */
export type SessionData = z.infer<typeof sessionDataSchema>

// const roleIdSchema = z
//   .string()
//   .refine(isRoleId)
//   .transform((r) => r as RoleId)

const sessionDataSchema = z.object({
  displayName: z.string().nullable(),
  userId: z.string(),
  // currentRoleId: roleIdSchema,
  // allowedRoleIds: z.array(roleIdSchema),
})
