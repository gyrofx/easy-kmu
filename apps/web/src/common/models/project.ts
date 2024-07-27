import { zodContact, type ContactWithId } from '@/common/models/contact'
import { type Employee, zodEmployee } from '@/common/models/employee'
import type { IsoDateString } from '@easy-kmu/common'
import { z } from 'zod'

export interface Project {
  id?: string

  name: string
  description: string
  notes: string

  customerContactId?: string
  customer?: ContactWithId
  customerPersonsInCharge: string[]

  objectId?: string

  constructionManagementContactId?: string
  constructionManagement?: ContactWithId
  constructionManagementPersonsInCharge: string[]

  architectContactId?: string
  architect?: ContactWithId
  architectPersonsInCharge: string[]

  builderContactId?: string
  builder?: ContactWithId
  builderPersonsInCharge: string[]

  clerkEmployeeId: string
  clerk: Employee

  material: string
  assembly: string
  surface: string
  fireProtection: string
  en1090: string
  deadline?: IsoDateString

  createdAt: string
  updatedAt: string
}

export interface ProjectWithId extends Project {
  id: string
}

export interface CreateOrUpdateProject
  extends Omit<
    Project,
    'createdAt' | 'updatedAt' | 'customer' | 'constructionManagement' | 'architect' | 'builder' | 'clerk'
  > {}

export const zodCreateOrUpdateProject = z.object({
  id: z.string().optional(),

  name: z.string(),
  description: z.string(),
  notes: z.string(),

  customerContactId: z.string().optional(),
  customerPersonsInCharge: z.array(z.string()),

  objectId: z.string().optional(),

  constructionManagementContactId: z.string().optional(),

  architectContactId: z.string().optional(),

  builderContactId: z.string().optional(),

  clerkEmployeeId: z.string(),

  material: z.string(),
  assembly: z.string(),
  surface: z.string(),
  fireProtection: z.string(),
  en1090: z.string(),
  deadline: z.string().optional(),
})

export const zodProject = z.object({
  id: z.string(),

  name: z.string(),
  description: z.string(),
  notes: z.string(),

  customerContactId: z.string().optional(),
  customer: zodContact.optional(),
  ustomerPersonsInCharge: z.array(z.string()),

  objectId: z.string().optional(),

  constructionManagementContactId: z.string().optional(),
  constructionManagement: zodContact.optional(),

  architectContactId: z.string().optional(),
  architect: zodContact.optional(),

  builderContactId: z.string().optional(),
  builder: zodContact.optional(),

  clerkEmployeeId: z.string(),
  clerk: zodEmployee,

  material: z.string(),
  assembly: z.string(),
  surface: z.string(),
  fireProtection: z.string(),
  en1090: z.string(),
  deadline: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
})
