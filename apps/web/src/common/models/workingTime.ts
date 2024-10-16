import { userSchema } from '@/common/models/user'
import type { AdapterUser } from '@auth/express/adapters'
import { type IsoDateString, zodIsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export interface CreateOrUpdateSpecialDay {
  id?: string
  day: IsoDateString
  overridenWorkingTimeInMin: number
}

export interface SpecialDay extends CreateOrUpdateSpecialDay {
  id: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export interface CreateOrUpdateWorkingTime {
  id?: string
  from: Date
  to: Date
  regularWorkingTimePerDayInMin: number
}

export interface WorkingTime extends CreateOrUpdateWorkingTime {
  id: string
  userId: string
  user: AdapterUser

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const workType = [
  'task',
  'illnes',
  'weeding',
  'bereavement',
  'changeResidence',
  'doctorVisit',
  'other',
] as const
export type WorkType = (typeof workType)[number]
export const zodWorkType = z.enum(workType)

export interface CreateOrUpdateWorkingTimeEntry {
  id?: string

  day: IsoDateString
  workingTimeInMin: number
  workType: WorkType
  taskId?: string
  comment: string
}

export interface WorkingTimeEntry extends CreateOrUpdateWorkingTimeEntry {
  id: string

  userId: string
  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodCreateOrUpdateSpecialDay = z.object({
  id: z.string().optional(),

  day: zodIsoDateString,
  overridenWorkingTimeInMin: z.number(),
})

export const zodSpecialDay = zodCreateOrUpdateSpecialDay.extend({
  id: z.string(),

  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export const zodCreateOrUpdateWorkingTime = z.object({
  id: z.string().optional(),

  from: z.date(),
  to: z.date(),
  regularWorkingTimePerDayInMin: z.number(),
})

export const zodWorkingTime = zodCreateOrUpdateWorkingTime.extend({
  id: z.string(),

  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export const zodCreateOrUpdateWorkingTimeEntry = z.object({
  id: z.string().optional(),

  day: zodIsoDateString,
  workingTimeInMin: z.number(),
  workType: zodWorkType,
  taskId: z.string().optional(),
  comment: z.string(),
})

export const zodWorkingTimeEntry = zodCreateOrUpdateWorkingTimeEntry.extend({
  id: z.string(),

  userId: z.string(),
  // user: userSchema,

  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodSpecialDay>, SpecialDay>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateSpecialDay>, CreateOrUpdateSpecialDay>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateWorkingTime>, CreateOrUpdateWorkingTime>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateWorkingTime>, CreateOrUpdateWorkingTime>>
  | AssertTrue<
      IsExact<z.infer<typeof zodCreateOrUpdateWorkingTimeEntry>, CreateOrUpdateWorkingTimeEntry>
    >
  | AssertTrue<IsExact<z.infer<typeof zodWorkingTimeEntry>, WorkingTimeEntry>>
