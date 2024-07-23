import { z } from 'zod'

export interface ProjectObject {
  id?: string

  address: string
  zipCode: string
  city: string
  country: string
  floor: string
  appartement: string
  workshopOrder: string
  notes: string
  createdAt: string
  updatedAt: string
}

export const zodProjectObject = z.object({
  id: z.string().optional(),

  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
  floor: z.string(),
  appartement: z.string(),
  workshopOrder: z.string(),
  notes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
