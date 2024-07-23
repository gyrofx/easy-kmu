import { z } from 'zod'

export const zodPersons = z.array(
  z.object({
    name: z.string(),
    role: z.string(),
    email: z.string(),
    phone1: z.string(),
    phone2: z.string(),
    notes: z.string(),
  }),
)

export const zodCreateOrUpdateContact = z.object({
  id: z.string().optional(),

  salutation: z.string(),
  gender: z.string(),
  company: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  additional1: z.string(),
  additional2: z.string(),
  address: z.string(),
  zipCode: z.string(),
  city: z.string(),
  country: z.string(),
  pobox: z.string(),
  notes: z.string(),

  persons: zodPersons,
})

export const zodContact = zodCreateOrUpdateContact.extend({
  id: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
})

export interface Contact extends CreateOrUpdateContact {
  id: string

  createdAt: string
  updatedAt: string
}

export interface CreateOrUpdateContact {
  id?: string

  salutation: string
  gender: string
  company: string
  firstName: string
  lastName: string
  additional1: string
  additional2: string
  address: string
  zipCode: string
  city: string
  country: string
  pobox: string
  notes: string

  persons: Person[]
}

export interface Person {
  name: string
  role: string
  email: string
  phone1: string
  phone2: string
  notes: string
}

// export const TypeTest = Assert
