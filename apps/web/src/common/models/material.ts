import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export interface CreateOrUpdateMaterial {
  id?: string

  materialGroupId: string

  name: string
  kgPerMeter?: number
  centsPerMeter?: number
  centsPerKg?: number
  meterPerUnit?: number
}

export interface Material extends CreateOrUpdateMaterial {
  id: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodCreateOrUpdateMaterial = z.object({
  id: z.string().optional(),
  materialGroupId: z.string(),
  name: z.string(),
  kgPerMeter: z.number().optional(),
  centsPerMeter: z.number().optional(),
  centsPerKg: z.number().optional(),
  meterPerUnit: z.number().optional(),
})

export const zodMaterial = zodCreateOrUpdateMaterial.extend({
  id: z.string(),
  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export interface CreateOrUpdateMaterialGroup {
  id?: string

  name: string
  image: string
}

export interface MaterialGroup extends CreateOrUpdateMaterialGroup {
  id: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodCreateOrUpdateMaterialGroup = z.object({
  id: z.string().optional(),
  name: z.string(),
  image: z.string(),
})

export const zodMaterialGroup = zodCreateOrUpdateMaterialGroup.extend({
  id: z.string(),
  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodMaterial>, Material>>
  | AssertTrue<IsExact<z.infer<typeof zodMaterialGroup>, MaterialGroup>>
