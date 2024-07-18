import { createInvoiceSchema } from '@/common/invoice/CreateInvoice'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { zodContact } from '@/common/contact/contact'

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
    body: zodContact,
    responses: { 200: zodContact },
  },

  listContacts: {
    method: 'GET',
    path: '/api/listContacts',
    responses: { 200: z.array(zodContact) },
  },
})
