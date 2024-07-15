import { createQrBill } from '@/server/invoice/qrbill'

async function main() {
  createQrBill()
}

main().catch(console.error)
