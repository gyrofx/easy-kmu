import { createInvoiceSchema } from '@/common/invoice/CreateInvoice'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { zodProjectObject } from '@/common/models/projectObject'
import { zodContact, zodCreateOrUpdateContact } from '@/common/models/contact'
import { zodCreateOrUpdateProject, zodProject } from '@/common/models/project'
import { zodEmployee } from '@/common/models/employee'

export const contract = initContract()

export const serverInfoSchema = z.object({
  opts: z.object({
    isDevelopment: z.boolean(),
  }),
})

export const api = contract.router({
  serverInfo: {
    method: 'GET',
    path: '/api/server-info',
    responses: { 200: serverInfoSchema },
  },

  createInvoicePdf: {
    method: 'POST',
    path: '/api/invoice/pdf',
    body: createInvoiceSchema,
    responses: { 200: z.object({ url: z.string() }), 500: z.unknown() },
  },

  downloadFile: {
    method: 'GET',
    path: '/files/:id',
    responses: { 200: z.unknown() },
  },

  createOrUpdateContact: {
    method: 'POST',
    path: '/api/create-or-update-contact',
    body: zodCreateOrUpdateContact,
    responses: { 200: zodContact },
  },

  listContacts: {
    method: 'GET',
    path: '/api/list-contacts',
    responses: { 200: z.array(zodContact) },
  },

  listProjectObjects: {
    method: 'GET',
    path: '/api/list-project-objects',
    responses: { 200: z.array(zodProjectObject) },
  },

  listProjects: {
    method: 'GET',
    path: '/api/list-projects',
    responses: { 200: z.array(zodProject) },
  },

  projectById: {
    method: 'GET',
    path: '/api/project-by-id/:id',
    responses: { 200: zodProject, 404: z.object({ error: z.string() }) },
  },

  createOrUpdateProject: {
    method: 'POST',
    path: '/api/create-or-update-project',
    body: zodCreateOrUpdateProject,
    responses: { 200: zodProject },
  },

  listEmployees: {
    method: 'GET',
    path: '/api/list-employees',
    responses: { 200: z.array(zodEmployee) },
  },
})
