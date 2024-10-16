import { createInvoiceSchema } from '@/common/invoice/CreateInvoice'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'

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
})
