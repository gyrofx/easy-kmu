import { z } from 'zod'
import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'

export const zodCreateOrUpdateQuote = z.object({
  id: z.string().optional(),

  projectId: z.string(),
  quoteNumber: z.number(),
  date: zodIsoDateString,
  state: z.enum(['draft', 'offerd', 'rejected', 'accepted']),

  to: z.string(),
  description: z.array(z.object({ key: z.string(), value: z.string() })),
  items: z.array(z.object({ pos: z.string(), text: z.string(), price: z.number() })),

  total: z.object({
    subtotal: z.number(),
    mwst: z.number(),
    total: z.number(),
    discount: z.object({ amount: z.number(), percent: z.number() }),
    earlyPaymentDiscount: z.object({ amount: z.number(), percent: z.number() }),
  }),

  textBlocks: z.array(z.string()),
  notes: z.string(),
})

export const zodQuote = zodCreateOrUpdateQuote.extend({
  id: z.string(),

  filePath: z.string().optional(),

  createdAt: z.string(),
  updatedAt: z.string(),
})

export interface Quote extends CreateOrUpdateQuote {
  id: string

  filePath?: string

  createdAt: string
  updatedAt: string
}

export interface CreateOrUpdateQuote {
  id?: string

  projectId: string

  quoteNumber: number
  date: IsoDateString
  state: 'draft' | 'offerd' | 'rejected' | 'accepted'

  to: string
  description: { key: string; value: string }[]
  items: { pos: string; text: string; price: number }[]

  total: {
    subtotal: number
    mwst: number
    total: number
    discount: { amount: number; percent: number }
    earlyPaymentDiscount: { amount: number; percent: number }
  }

  textBlocks: string[]
  notes: string
}

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodQuote>, Quote>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateQuote>, CreateOrUpdateQuote>>
