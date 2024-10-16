import { zodFile, type File } from '@/common/models/file'
import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export type TaskStatus = 'todo' | 'inProgress' | 'done'

export interface CreateOrUpdateTask {
  id?: string

  projectId: string
  name: string
  description: string
  notes: string

  state: TaskStatus

  cardFileId?: string
  cardFile?: File
}

export interface Task extends CreateOrUpdateTask {
  id: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodTaskState = z.enum(['todo', 'inProgress', 'done'])

export const zodCreateOrUpdateTask = z.object({
  id: z.string().optional(),

  projectId: z.string(),
  cardFileId: z.string().optional(),
  cardFile: zodFile.optional(),

  state: zodTaskState,

  name: z.string(),
  description: z.string(),
  notes: z.string(),
})

export const zodTask = zodCreateOrUpdateTask.extend({
  id: z.string(),

  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodTask>, Task>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateTask>, CreateOrUpdateTask>>
