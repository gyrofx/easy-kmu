import { rm } from 'node:fs/promises'
import { join } from 'node:path'
import { opts } from '@/server/config/opts'
import { deleteQuoteFromDb } from '@/server/models/quote/db/deleteQuoteFromDb'
import { findQuoteById } from '@/server/models/quote/db/findQuoteById'

export async function deleteQuote(quoteId: string) {
  const quote = await findQuoteById(quoteId)
  if (!quote) throw new Error('Quote not found')
  if (quote.state === 'draft' || quote.state === 'readyToOffer') {
    if (quote.filePath) {
      const filename = join(opts().fileStorage.path, quote.filePath)
      await rm(filename)
    }
    await deleteQuoteFromDb(quote.id)
  }
  throw new Error('Cannot delete draft quotes')
}
