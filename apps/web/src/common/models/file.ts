import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'
import { z } from 'zod'

export interface CreateOrUpdateFile {
  id?: string

  path: string
  mimeType: string
}

export interface File extends CreateOrUpdateFile {
  id: string

  createdAt: IsoDateString
  updatedAt: IsoDateString
}

export const zodCreateOrUpdateFile = z.object({
  id: z.string().optional(),
  path: z.string(),
  mimeType: z.string(),
})

export const zodFile = zodCreateOrUpdateFile.extend({
  id: z.string(),
  createdAt: zodIsoDateString,
  updatedAt: zodIsoDateString,
})

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodFile>, File>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateFile>, CreateOrUpdateFile>>
