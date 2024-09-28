import type { QuoteState } from '@/common/models/quote'
import { db } from '@/server/db/db'
import { quotes } from '@/server/db/schema/quotes'
import { findQuoteById } from '@/server/models/quote/db/findQuoteById'
import { generateQuotePdf } from '@/server/models/quote/generateQuotePdf'
import { eq } from 'drizzle-orm'

export async function updateQuoteState(quoteId: string, newState: QuoteState) {
  const quote = await findQuoteById(quoteId)
  if (!quote) throw new Error('Quote not found')
  const currentState = quote.state

  if (newState !== 'draft') {
    if (currentState === 'draft') {
      if (!quote.filePath) {
        await generateQuotePdf(quoteId)
      }
    }
  }
  await db()
    .update(quotes)
    .set({ state: newState })
    .where(eq(quotes.id, quote.id))
    .returning({ id: quotes.id })

  return findQuoteById(quoteId)
}
