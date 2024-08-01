import { z } from 'zod'
import { qrBillSchema } from './qrBillSchema'
import type { Data } from 'swissqrbill/types'
import type { AssertTrue, IsExact } from 'conditional-type-checks'

export const createInvoiceSchema = z.object({
  to: z.object({
    company: z.string().optional(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  date: z.string(),
  quote: z.object({
    id: z.string(),
  }),
  project: z.array(z.object({ key: z.string(), value: z.string() })),
  items: z.array(z.object({ pos: z.string(), text: z.string(), price: z.string() })),
  total: z.object({
    subtotal: z.string(),
    mwst: z.string(),
    total: z.string(),
  }),
  textAfterTotal: z.array(z.string()),
  qrbill: qrBillSchema,
})

export interface CreateInvoice {
  to: {
    company?: string
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  date: string
  quote: {
    id: string
  }
  project: Array<{ key: string; value: string }>
  items: Array<{ pos: string; text: string; price: string }>
  total: {
    subtotal: string
    mwst: string
    total: string
    // discount: { amount: string; percent: string } | undefined
    // earlyPaymentDiscount: { amount: string; percent: string } | undefined
  }
  textAfterTotal: Array<string>
  qrbill: Data
}

export type TypeTest = AssertTrue<IsExact<z.infer<typeof createInvoiceSchema>, CreateInvoice>>
