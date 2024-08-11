import { zodContact, type Contact } from '@/common/models/contact'
import { type Employee, zodEmployee } from '@/common/models/employee'
import { zodProjectObject, type ProjectObject } from '@/common/models/projectObject'
import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export interface CreateOrUpdateProject {
  id?: string

  name: string
  description: string
  notes: string

  customerContactId?: string
  customerPersonsInCharge: string[]

  objectId?: string

  constructionManagementContactId?: string
  constructionManagementPersonsInCharge: string[]

  architectContactId?: string
  architectPersonsInCharge: string[]

  builderContactId?: string
  builderPersonsInCharge: string[]

  clerkEmployeeId: string

  material: string
  assembly: string
  surface: string
  fireProtection: string
  en1090: string
  deadline?: IsoDateString
}

export interface Project extends CreateOrUpdateProject {
  id: string
  projectNumber: string
  object?: ProjectObject
  customer?: Contact
  constructionManagement?: Contact
  architect?: Contact
  builder?: Contact
  clerk: Employee
  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodCreateOrUpdateProject = z.object({
  id: z.string().optional(),

  name: z.string(),
  description: z.string(),
  notes: z.string(),

  customerContactId: z.string().optional(),
  customerPersonsInCharge: z.array(z.string()),

  objectId: z.string().optional(),

  constructionManagementContactId: z.string().optional(),
  constructionManagementPersonsInCharge: z.array(z.string()),

  architectContactId: z.string().optional(),
  architectPersonsInCharge: z.array(z.string()),

  builderContactId: z.string().optional(),
  builderPersonsInCharge: z.array(z.string()),

  clerkEmployeeId: z.string(),

  material: z.string(),
  assembly: z.string(),
  surface: z.string(),
  fireProtection: z.string(),
  en1090: z.string(),
  deadline: zodIsoDateString.optional(),
})

export const zodProject = zodCreateOrUpdateProject.extend({
  id: z.string(),
  projectNumber: z.string(),
  object: zodProjectObject.optional(),
  customer: zodContact.optional(),
  constructionManagement: zodContact.optional(),
  architect: zodContact.optional(),
  builder: zodContact.optional(),
  clerk: zodEmployee,
  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodProject>, Project>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateProject>, CreateOrUpdateProject>>
