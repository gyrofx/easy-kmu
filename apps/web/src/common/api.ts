import { ContractNoBody, initContract } from '@ts-rest/core'
import { z } from 'zod'
import { zodProjectObject } from '@/common/models/projectObject'
import { zodContact, zodCreateOrUpdateContact } from '@/common/models/contact'
import { zodCreateOrUpdateProject, zodProject } from '@/common/models/project'
import { zodEmployee } from '@/common/models/employee'
import { zodCreateOrUpdateQuote, zodQuote, zodQuoteState } from '@/common/models/quote'

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

  listQuotesByProject: {
    method: 'GET',
    path: '/api/list-quotes-by-project',
    query: z.object({ projectId: z.string() }),
    responses: { 200: z.array(zodQuote) },
  },

  quoteById: {
    method: 'GET',
    path: '/api/quote-by-id',
    query: z.object({ quoteId: z.string() }),
    responses: { 200: zodQuote },
  },

  updateQuoteState: {
    method: 'POST',
    path: '/api/quote/:quoteId/update-quote-state',
    // query: z.object({ quoteId: z.string() }),
    body: z.object({ state: zodQuoteState }),
    responses: { 200: zodQuote },
  },

  createOrUpdateQuote: {
    method: 'POST',
    path: '/api/create-or-update-quote',
    body: zodCreateOrUpdateQuote,
    responses: { 200: zodQuote },
  },

  deleteQuote: {
    method: 'DELETE',
    path: '/api/delete-quote/:quoteId',
    body: ContractNoBody,
    responses: { 200: z.object({ success: z.boolean() }) },
  },

  generateQuotePdf: {
    method: 'POST',
    path: '/api/create-quote-pdf/:quoteId',
    body: ContractNoBody,
    responses: { 200: zodQuote },
  },
})
