import { createExpressEndpoints, initServer } from '@ts-rest/express'
import type { Express } from 'express'
import { api } from '@/common/api'
import { serverInfo } from '@/server/serverInfo/serverInfo'
import { createReadStream } from 'node:fs'
import { opts } from '@/server/config/opts'
import { join } from 'node:path'
import { createOrUpdateContact } from '../models/contact/db/createOrUpdateContact'
import { listContacts } from '../models/contact/db/listContacts'
import { listProjectObjects } from '@/server/models/projectObject/db/listProjectObjects'
import { listProjects } from '@/server/models/project/db/listProject'
import { listEmployees } from '@/server/models/employee/db/listEmployees'
import { createOrUpdateProject } from '@/server/models/project/db/createOrUpdateProject'
import { findFirstProject } from '@/server/models/project/db/findFirstProject'
import { listQuotesByProject } from '@/server/models/quote/db/listQuotesByProject'
import { createOrUpdateQuote } from '@/server/models/quote/db/createOrUpdateQuote'
import { generateQuotePdf } from '@/server/models/quote/generateQuotePdf'
import { deleteQuote } from '@/server/models/quote/deleteQuote'
import { findQuoteById } from '@/server/models/quote/db/findQuoteById'
import { updateQuoteState } from '@/server/models/quote/updateQuoteState'
import { listMaterial } from '@/server/models/material/listMaterial'
import { listMaterialGroup } from '@/server/models/material/listMaterialGroup'
import { createOrUpdateMaterial } from '@/server/models/material/createOrUpdateMaterial'

export function initApi(app: Express) {
  const server = initServer()
  const router = server.router(api, {
    serverInfo: async () => ({ status: 200, body: serverInfo() }),

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
      const contact = await createOrUpdateContact(body)
      return { status: 200, body: contact }
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
      if (!project) return { status: 404, body: { error: 'Not found' } }
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

    quoteById: async ({ query }) => {
      const quote = await findQuoteById(query.quoteId)
      if (quote) return { status: 200, body: quote }
      return { status: 404, body: { error: 'Not found' } }
    },

    createOrUpdateQuote: async ({ body }) => {
      const quote = await createOrUpdateQuote(body)
      if (!quote) return { status: 404, body: { error: 'Not found' } }
      return { status: 200, body: quote }
    },

    updateQuoteState: async ({ body, params }) => {
      const quote = await updateQuoteState(params.quoteId, body.state)
      if (!quote) return { status: 404, body: { error: 'Not found' } }
      return { status: 200, body: quote }
    },

    generateQuotePdf: async ({ params }) => {
      const quote = await generateQuotePdf(params.quoteId)
      if (!quote) return { status: 404, body: { error: 'Not found' } }
      return { status: 200, body: quote }
    },

    deleteQuote: async ({ params }) => {
      await deleteQuote(params.quoteId)
      return { status: 200, body: { success: true } }
    },

    materials: async () => {
      const materials = await listMaterial()
      return { status: 200, body: materials }
    },

    createOrUpdateMaterial: async ({ body }) => {
      const material = await createOrUpdateMaterial(body)
      return { status: 200, body: material }
    },

    materialGroups: async () => {
      const groups = await listMaterialGroup()
      return { status: 200, body: groups }
    },
  })

  createExpressEndpoints(api, router, app)
}
