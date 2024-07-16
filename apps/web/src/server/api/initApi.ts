import { createExpressEndpoints, initServer } from '@ts-rest/express'
import type { Express } from 'express'
import { api } from '@/common/api'
import { serverInfo } from '@/server/serverInfo/serverInfo'
import { createReadStream } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { Agent } from 'undici'
import type { CreateInvoice as CreateInvoiceFull } from '@easy-kmu/common'
import { sum } from 'lodash'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { opts } from '@/server/config/opts'
import { join } from 'node:path'

export function initApi(app: Express) {
  const server = initServer()
  const router = server.router(api, {
    serverInfo: async () => ({ status: 200, body: serverInfo() }),

    createInvoicePdf: async ({ body }) => {
      const subtotal = sum(body.items.map((item) => item.price))
      const mwst = subtotal * 0.081
      const total = subtotal + mwst

      const fullInvoice: CreateInvoiceFull = {
        ...body,
        date: format(new Date(), 'PP', { locale: de }),
        quote: { id: body.invoiceNumber },
        project: body.project.map((project) => ({
          key: project[0],
          value: project[1],
        })),
        items: body.items.map((item) => ({
          ...item,
          price: toChf(item.price),
        })),
        total: {
          subtotal: toChf(subtotal),
          mwst: toChf(mwst),
          total: toChf(total),
        },
        textAfterTotal: body.snippets.map((snippet) => snippet.text),
        qrbill: {
          amount: total,
          creditor: {
            account: 'CH44 3199 9123 0008 8901 2',
            address: 'Musterstrasse',
            buildingNumber: 7,
            city: 'Musterstadt',
            country: 'CH',
            name: 'SwissQRBill',
            zip: '1234',
          },
          currency: 'CHF',
          debtor: {
            address: body.to.address,
            buildingNumber: '',
            city: body.to.city,
            country: 'CH',
            name: body.to.name,
            zip: body.to.zip,
          },
          reference: '21 00000 00003 13947 14300 09017',
        },
      }

      const httpsAgent = new Agent({
        connect: {
          rejectUnauthorized: false,
        },
      })

      const url = `${opts().pdfService.url}/api/pdf/invoice`
      console.log('url', url)
      const responose = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(fullInvoice),
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

      return {
        status: 200,
        body: {
          url: `/files/${fileID}.pdf`,
        },
      }
    },

    downloadFile: async ({ res, params }) => {
      try {
        const filename = join(opts().fileStorage.path, `${params.id}`)
        console.log('filename', filename)
        const s = createReadStream(filename)

        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')
        res.setHeader('Content-Disposition', `attachment; ${params.id}`)
        res.setHeader('Content-type', 'application/pdf')

        return { status: 200, body: s }
      } catch (error) {
        return { status: 404, body: { error: 'Not found' } }
      }
    },
  })

  createExpressEndpoints(api, router, app)
}

function toChf(amount: number) {
  return `Fr. ${amount.toFixed(2)}`
}
