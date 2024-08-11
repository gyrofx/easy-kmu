import { z } from 'zod'

export interface CreateInvoice {
  invoiceNumber: string
  project: [string, string][]
  to: {
    company?: string
    name: string
    address: string
    city: string
    state: string
    zip: string
  }
  items: { pos: string; text: string; price: number }[]

  discount: { type: 'percent' | 'amount'; value: number } | undefined
  earlyPaymentDiscount: { type: 'percent' | 'amount'; value: number } | undefined

  snippets: Snippet[]
}

export interface Snippet {
  label: string
  text: string
}

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string(),
  project: z.array(z.tuple([z.string(), z.string()])),
  to: z.object({
    company: z.string().optional(),
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
  items: z.array(z.object({ pos: z.string(), text: z.string(), price: z.number() })),
  total: z.object({
    discount: z.object({ type: z.enum(['percent', 'amount']), value: z.number() }).optional(),
    earlyPaymentDiscount: z
      .object({ type: z.enum(['percent', 'amount']), value: z.number() })
      .optional(),
  }),
  snippets: z.array(z.object({ label: z.string(), text: z.string() })),
})
