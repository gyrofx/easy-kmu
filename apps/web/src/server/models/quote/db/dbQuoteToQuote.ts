import type { Quote } from '@/common/models/quote'
import { IsoDateString } from '@easy-kmu/common'
import { z } from 'zod'
import type { SelectQuote } from '@/server/db/schema'

export function dbQuoteToQuote(dbQuote: SelectQuote): Quote {
  return {
    ...dbQuote,
    ...zodQuoteDataToQuote.parse(dbQuote.data),
    date: IsoDateString(dbQuote.date),
    filePath: dbQuote.filePath || undefined,
    createdAt: IsoDateString(dbQuote.createdAt),
    updatedAt: IsoDateString(dbQuote.updatedAt),
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
    discount: z.object({ type: z.enum(['percent', 'amount']), value: z.number() }),
    earlyPaymentDiscount: z.object({ type: z.enum(['percent', 'amount']), value: z.number() }),
  }),

  textBlocks: z.array(z.string()),
})
