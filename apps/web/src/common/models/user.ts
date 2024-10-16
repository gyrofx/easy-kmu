import type { Session } from '@auth/express'
import type { AdapterUser } from '@auth/express/adapters'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
})

export const sessionSchema = z.object({
  user: userSchema.optional(),
  expires: z.string(),
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof userSchema>, AdapterUser>>
  | AssertTrue<IsExact<z.infer<typeof sessionSchema>, Session>>
