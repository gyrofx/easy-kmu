import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import { z } from 'zod'
import type { AssertTrue, IsExact } from 'conditional-type-checks'

export interface CreateOrupdateEmployee {
  id: string

  firstName: string
  lastName: string
  email: string
  phone1: string
  phone2: string

  notes: string
}

export interface Employee extends CreateOrupdateEmployee {
  id: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodEmployeeCreateOrUpdate = z.object({
  id: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone1: z.string(),
  phone2: z.string(),

  notes: z.string(),
})

export const zodEmployee = zodEmployeeCreateOrUpdate.extend({
  id: z.string(),
  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest = AssertTrue<IsExact<z.infer<typeof zodEmployee>, Employee>>
