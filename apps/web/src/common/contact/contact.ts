import { z } from 'zod'

export const zodContact = z.object({
  id: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),

  salutation: z.string().optional(),
  gender: z.string().optional(),
  company: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  additional1: z.string().optional(),
  additional2: z.string().optional(),
  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string().optional(),
  pobox: z.string().optional(),
  notes: z.string().optional(),
})

export interface Contact {
  id?: string

  // createdAt: string
  // updatedAt: string

  salutation?: string
  gender?: string
  company?: string
  firstName: string
  lastName: string
  additional1?: string
  additional2?: string
  address: string
  zipCode: string
  city: string
  country?: string
  pobox?: string
  notes?: string

  createdAt: string
  updatedAt: string

  persons?: Person[]
}

export interface Person {}

// export const TypeTest = Assert
