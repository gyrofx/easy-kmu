import type { Quote } from '@/common/models/quote'
import { IsoDateString } from '@easy-kmu/common'
import { z } from 'zod'
import type { SelectQuote } from '@/server/db/schema'

export function dbQuoteToQuote(dbProject: SelectQuote): Quote {
  return {
    ...dbProject,
    ...zodQuoteDataToQuote.parse(dbProject.data),
    date: IsoDateString(dbProject.date),
    filePath: dbProject.filePath || undefined,
    createdAt: IsoDateString(dbProject.createdAt),
    updatedAt: IsoDateString(dbProject.updatedAt),
  }
}

const zodQuoteDataToQuote = z.object({
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
})
