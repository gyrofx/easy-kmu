import { db } from '@/server/db/db'
import { quotes } from '@/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { zodCreateOrUpdateQuote, type CreateOrUpdateQuote } from '@/common/models/quote'
import { findQuoteById } from '@/server/models/quote/db/findQuoteById'
import { parseISO } from 'date-fns'
import { zodParse } from '@easy-kmu/common'

export async function createOrUpdateQuote(quote: CreateOrUpdateQuote) {
  const { to, description, items, total, textBlocks, date, ...dbProps } = quote

  // TODO: replace naiv implementation
  const quoteNumber = dbProps.id ? dbProps.quoteNumber : await nextQuoteNumber(dbProps.projectId)

  const dbQuote = {
    ...zodParse(zodCreateOrUpdateQuote, quote),
    quoteNumber,
    date: parseISO(date),
    data: { to, description, items, total, textBlocks },
  }

  const ids = dbQuote.id
    ? await db()
        .update(quotes)
        .set(dbQuote)
        .where(eq(quotes.id, dbQuote.id))
        .returning({ id: quotes.id })
    : await db()
        .insert(quotes)
        .values({ ...dbQuote, filePath: null })
        .returning({ id: quotes.id })

  const id = ids[0]?.id
  if (!id) throw new Error('No id returned from insert or update')
  return findQuoteById(id)
}

async function nextQuoteNumber(projectId: string) {
  const lastQuoteNumber = await db().query.quotes.findFirst({
    where: eq(quotes.projectId, projectId),
    columns: {
      quoteNumber: true,
    },
    orderBy: [desc(quotes.quoteNumber)],
  })

  return lastQuoteNumber ? lastQuoteNumber.quoteNumber + 1 : 1
}
