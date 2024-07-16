import { createInvoiceTest } from '@/server/pdf/createInvoice'

async function main() {
  createInvoiceTest()
}

main().catch(console.error)
