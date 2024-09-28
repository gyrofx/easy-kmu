import { db } from '@/server/db/db'
import { quotes } from '@/server/db/schema/quotes'
import { eq } from 'drizzle-orm'

export async function deleteQuoteFromDb(quoteId: string) {
  return db().delete(quotes).where(eq(quotes.id, quoteId))
}
