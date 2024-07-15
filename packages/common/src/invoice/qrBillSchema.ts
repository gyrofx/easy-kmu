import type { AssertTrue, IsExact } from 'conditional-type-checks'
import type { Data } from 'swissqrbill/types'
import { z } from 'zod'

export const qrBillSchema = z.object({
  creditor: z.object({
    name: z.string(),
    address: z.string(),
    zip: z.union([z.string(), z.number()]),
    city: z.string(),
    country: z.string(),
    account: z.string(),
    buildingNumber: z.union([z.string(), z.number()]).optional(),
  }),
  currency: z.literal('CHF').or(z.literal('EUR')),
  additionalInformation: z.string().optional(),
  amount: z.number().optional(),
  av1: z.string().optional(),
  av2: z.string().optional(),
  debtor: z
    .object({
      name: z.string(),
      address: z.string(),
      zip: z.union([z.string(), z.number()]),
      city: z.string(),
      country: z.string(),
      buildingNumber: z.union([z.string(), z.number()]).optional(),
    })
    .optional(),
  message: z.string().optional(),
  reference: z.string().optional(),
})

export type TypeTest = AssertTrue<IsExact<z.infer<typeof qrBillSchema>, Data>>
