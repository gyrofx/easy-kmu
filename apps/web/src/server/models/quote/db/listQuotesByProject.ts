import { db } from '@/server/db/db'
import type { Quote } from '@/common/models/quote'
import { dbQuoteToQuote } from '@/server/models/quote/db/dbQuoteToQuote'
import { projects } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export async function listQuotesByProject(projectId: string): Promise<Quote[]> {
  const quotes = await listQuoteInnerByProject(projectId)
  return quotes.map(dbQuoteToQuote)
}

async function listQuoteInnerByProject(projectId: string) {
  return await db().query.projects.findMany({ where: eq(projects.id, projectId) })
}
