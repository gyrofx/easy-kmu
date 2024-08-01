import { createExpressEndpoints, initServer } from '@ts-rest/express'
import type { Express } from 'express'
import { api } from '@/common/api'
import { serverInfo } from '@/server/serverInfo/serverInfo'
import { createReadStream } from 'node:fs'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { Agent } from 'undici'
import { opts } from '@/server/config/opts'
import { join } from 'node:path'
import { createOrUpdateContact } from '../models/contact/db/createOrUpdateContact'
import { listContacts } from '../models/contact/db/listContacts'
import { listProjectObjects } from '@/server/models/projectObject/db/listProjectObjects'
import { listProjects } from '@/server/models/project/db/listProject'
import { listEmployees } from '@/server/models/employee/db/listEmployees'
import { createOrUpdateProject } from '@/server/models/project/db/createOrUpdateProject'
import { findFirstProject } from '@/server/models/project/db/findFirstProject'
import { invoiceToHtml } from '@/server/invoice/invoiceToHtml'
import { listQuotesByProject } from '@/server/models/quote/db/listQuotesByProject'
import { createOrUpdateQuote } from '@/server/models/quote/db/createOrUpdateQuote'

export function initApi(app: Express) {
  const server = initServer()
  const router = server.router(api, {
    serverInfo: async () => ({ status: 200, body: serverInfo() }),

    createInvoicePdf: async ({ body }) => {
      // const subtotal = sum(body.items.map((item) => item.price))
      // const mwst = subtotal * 0.081
      // const total = subtotal + mwst

      // const fullInvoice: CreateInvoiceFull = {
      //   ...body,
      //   date: format(new Date(), 'PP', { locale: de }),
      //   quote: { id: body.invoiceNumber },
      //   project: body.project.map((project) => ({
      //     key: project[0],
      //     value: project[1],
      //   })),
      //   items: body.items.map((item) => ({
      //     ...item,
      //     price: toChf(item.price),
      //   })),
      //   total: {
      //     subtotal: toChf(subtotal),
      //     mwst: toChf(mwst),
      //     total: toChf(total),
      //   },
      //   textAfterTotal: body.snippets.map((snippet) => snippet.text),
      //   qrbill: {
      //     amount: total,
      //     creditor: {
      //       account: 'CH44 3199 9123 0008 8901 2',
      //       address: 'Musterstrasse',
      //       buildingNumber: 7,
      //       city: 'Musterstadt',
      //       country: 'CH',
      //       name: 'SwissQRBill',
      //       zip: '1234',
      //     },
      //     currency: 'CHF',
      //     debtor: {
      //       address: body.to.address,
      //       buildingNumber: '',
      //       city: body.to.city,
      //       country: 'CH',
      //       name: body.to.name,
      //       zip: body.to.zip,
      //     },
      //     reference: '21 00000 00003 13947 14300 09017',
      //   },
      // }

      const htmltoPdf = await invoiceToHtml(body)

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

    listContacts: async () => {
      const contacts = await listContacts()
      return { status: 200, body: contacts }
    },

    createOrUpdateContact: async ({ body }) => {
      return { status: 200, body: await createOrUpdateContact(body) }
    },

    listProjectObjects: async () => {
      const objects = await listProjectObjects()
      return { status: 200, body: objects }
    },

    listProjects: async () => {
      const projects = await listProjects()
      return { status: 200, body: projects }
    },

    projectById: async ({ params }) => {
      const project = await findFirstProject(params.id)
      if (!project) return { status: 404, body: { error: 'Not found' } }
      return { status: 200, body: project }
    },

    createOrUpdateProject: async ({ body }) => {
      const project = await createOrUpdateProject(body)
      return { status: 200, body: project }
    },

    listEmployees: async () => {
      const employees = await listEmployees()
      return { status: 200, body: employees }
    },

    listQuotesByProject: async ({ query }) => {
      const quotes = await listQuotesByProject(query.projectId)
      return { status: 200, body: quotes }
    },

    createOrUpdateQuote: async ({ body }) => {
      const quote = await createOrUpdateQuote(body)
      return { status: 200, body: quote }
    },
  })

  createExpressEndpoints(api, router, app)
}

function toChf(amount: number) {
  return `Fr. ${amount.toFixed(2)}`
}
