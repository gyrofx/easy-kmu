import { quoteToHtml } from '@/server/models/quote/quoteToHtml'
import { findQuoteById } from '@/server/models/quote/db/findQuoteById'
import { findFirstProject } from '@/server/models/project/db/findFirstProject'
import { Agent } from 'undici'
import { opts } from '@/server/config/opts'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { createOrUpdateQuote } from '@/server/models/quote/db/createOrUpdateQuote'

export async function generateQuotePdf(quoteId: string) {
  const quote = await findQuoteById(quoteId)
  if (!quote) throw new Error('Quote not found')

  console.log('generateQuotePdf', quote)

  const project = await findFirstProject(quote.projectId)
  if (!project) throw new Error('Project not found')

  const htmltoPdf = await quoteToHtml(quote, project)

  console.log('htmltoPdf', htmltoPdf)

  const httpsAgent = new Agent({
    connect: {
      rejectUnauthorized: false,
    },
  })

  const url = `${opts().pdfService.url}/api/html-to-pdf`
  console.log('url', url)
  const responose = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(htmltoPdf),
    headers: {
      'Content-Type': 'application/json',
    },
    dispatcher: httpsAgent,
  } as any)

  if (responose.status !== 200) {
    return { status: 500, body: await responose.json() }
  }

  const file = await responose.blob()
  const fileID = randomUUID()
  const filename = join(opts().fileStorage.path, `${fileID}.pdf`)
  await writeFile(filename, Buffer.from(await file.arrayBuffer()))

  return createOrUpdateQuote({ ...quote, filePath: `${fileID}.pdf` })
}
