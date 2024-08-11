import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export interface CreateOrUpdateObject {
  id?: string

  address: string
  zipCode: string
  city: string
  country: string
  floor: string
  appartement: string
  workshopOrder: string
  notes: string
}

export interface ProjectObject extends CreateOrUpdateObject {
  id: string

  createdAt: string
  updatedAt: string
}

export const zodCreateOrUpdateObject = z.object({
  id: z.string().optional(),

  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
  floor: z.string(),
  appartement: z.string(),
  workshopOrder: z.string(),
  notes: z.string(),
})

export const zodProjectObject = zodCreateOrUpdateObject.extend({
  id: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodProjectObject>, ProjectObject>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateObject>, CreateOrUpdateObject>>
