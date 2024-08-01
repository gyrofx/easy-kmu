import { z } from 'zod'
import { zodIsoDateString, type IsoDateString } from '@easy-kmu/common'
import type { AssertTrue, IsExact } from 'conditional-type-checks'

export const quoteStates = ['draft', 'readyToOffer', 'offerd', 'rejected', 'accepted'] as const
export type QuoteState = (typeof quoteStates)[number]

export const zodCreateOrUpdateQuote = z.object({
  id: z.string().optional(),

  projectId: z.string(),
  quoteNumber: z.number(),
  date: zodIsoDateString,
  state: z.enum(quoteStates),

  to: z.string(),
  description: z.array(z.object({ key: z.string(), value: z.string() })),
  items: z.array(z.object({ pos: z.string(), text: z.string(), price: z.number() })),

  total: z.object({
    subtotal: z.number(),
    mwst: z.number(),
    total: z.number(),
    discount: z.object({ type: z.enum(['amount', 'percent']), value: z.number() }),
    earlyPaymentDiscount: z.object({ type: z.enum(['amount', 'percent']), value: z.number() }),
  }),

  textBlocks: z.array(z.string()),
  notes: z.string(),

  filePath: z.string().optional(),
})

export const zodQuote = zodCreateOrUpdateQuote.extend({
  id: z.string(),

  createdAt: z.string(),
  updatedAt: z.string(),
})

export interface Quote extends CreateOrUpdateQuote {
  id: string

  createdAt: string
  updatedAt: string
}

export interface CreateOrUpdateQuote {
  id?: string

  projectId: string

  quoteNumber: number
  date: IsoDateString
  state: QuoteState

  to: string
  description: { key: string; value: string }[]
  items: { pos: string; text: string; price: number }[]

  total: {
    subtotal: number
    mwst: number
    total: number
    discount: { type: 'amount' | 'percent'; value: number }
    earlyPaymentDiscount: { type: 'amount' | 'percent'; value: number }
  }

  textBlocks: string[]
  notes: string

  filePath?: string
}

export type TypeTest =
  | AssertTrue<IsExact<z.infer<typeof zodQuote>, Quote>>
  | AssertTrue<IsExact<z.infer<typeof zodCreateOrUpdateQuote>, CreateOrUpdateQuote>>
