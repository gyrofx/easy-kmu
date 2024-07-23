import type { IsoDateString } from '@easy-kmu/common'
import { z } from 'zod'

export interface Employee {
  id?: string

  firstName: string
  lastName: string
  email: string
  phone1: string
  phone2: string

  notes: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export interface EmployeeWithId extends Employee {
  id: string
}

export const zodEmployeeCreate = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone1: z.string(),
  phone2: z.string(),

  notes: z.string(),
})

export const zodEmployee = zodEmployeeCreate.extend({
  id: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
