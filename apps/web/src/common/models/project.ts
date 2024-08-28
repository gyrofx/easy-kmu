import { zodContact, type Contact } from '@/common/models/contact'
import { type Employee, zodEmployee } from '@/common/models/employee'
import { zodProjectObject, type ProjectObject } from '@/common/models/projectObject'
import { zodIsoDateString, zodParse, type IsoDateString } from '@easy-kmu/common'
import type { Nominal } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export interface CreateOrUpdateProject {
  id?: string

  name: string
  description: string
  notes: string

  objectId?: string

  customerContactId?: string
  constructionManagementContactId?: string
  architectContactId?: string
  builderContactId?: string

  clerkEmployeeId: string
  projectManagerEmployeeId: string

  customerReference: string

  material: string
  assembly: string
  surface: string
  surfaceColor: string
  fireProtection: boolean
  fireProtectionOption: FireProtectionOption
  en1090: boolean
  en1090Option: EN1090Option
}

export type FireProtectionOption = Nominal<'level1' | 'level2' | 'level3', 'FireProtectionOption'>
export function asFireProtectionOption(level: string) {
  return zodParse(zodFireProtectionOption, level) as FireProtectionOption
}
const zodFireProtectionOption = z.union([z.literal('level1'), z.literal('level2'), z.literal('level3')])

export type EN1090Option = Nominal<'ex1' | 'ex2' | 'ex3', 'EN1090Option'>
export function asEN1090Option(level: string) {
  return zodParse(zodEn1090Option, level) as EN1090Option
}
const zodEn1090Option = z.union([z.literal('ex1'), z.literal('ex2'), z.literal('ex3')])

export interface Project extends CreateOrUpdateProject {
  id: string
  projectNumber: string
  object?: ProjectObject
  customer?: Contact
  constructionManagement?: Contact
  architect?: Contact
  builder?: Contact
  clerk: Employee
  projectManager: Employee
  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodCreateOrUpdateProject = z.object({
  id: z.string().optional(),

  name: z.string(),
  description: z.string(),
  notes: z.string(),

  objectId: z.string().optional(),

  customerContactId: z.string().optional(),
  constructionManagementContactId: z.string().optional(),
  architectContactId: z.string().optional(),
  builderContactId: z.string().optional(),

  clerkEmployeeId: z.string(),
  projectManagerEmployeeId: z.string(),

  customerReference: z.string(),

  material: z.string(),
  assembly: z.string(),
  surface: z.string(),
  surfaceColor: z.string(),
  fireProtection: z.boolean(),
  fireProtectionOption: z.string(),
  en1090: z.boolean(),
  en1090Option: z.string(),
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
  projectManager: zodEmployee,
  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodProject>, Project>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateProject>, CreateOrUpdateProject>>
