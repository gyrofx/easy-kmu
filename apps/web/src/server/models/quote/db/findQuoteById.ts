import { db } from '@/server/db/db'
import { dbQuoteToQuote } from '@/server/models/quote/db/dbQuoteToQuote'

export async function findQuoteById(id: string) {
  const quote = await findQuoteByIdInner(id)
  if (!quote) return undefined

  return dbQuoteToQuote(quote)
}

function findQuoteByIdInner(id: string) {
  return db().query.quotes.findFirst({
    where: (quotes, { eq }) => eq(quotes.id, id),
  })
}
