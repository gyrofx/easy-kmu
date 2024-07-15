import { z } from 'zod'
import type { AssertTrue, IsExact } from 'conditional-type-checks'

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
  snippets: z.array(z.object({ label: z.string(), text: z.string() })),
})

export type TypeTest = AssertTrue<IsExact<z.infer<typeof createInvoiceSchema>, CreateInvoice>>
