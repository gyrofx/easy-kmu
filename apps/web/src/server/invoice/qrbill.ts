import { writeFileSync } from 'node:fs'

import { SwissQRBill } from 'swissqrbill/svg'

const data = {
  amount: 1994.75,
  creditor: {
    account: 'CH44 3199 9123 0008 8901 2',
    address: 'Musterstrasse',
    buildingNumber: 7,
    city: 'Musterstadt',
    country: 'CH',
    name: 'SwissQRBill',
    zip: 1234,
  },
  currency: 'CHF' as const,
  debtor: {
    address: 'Musterstrasse',
    buildingNumber: 1,
    city: 'Musterstadt',
    country: 'CH',
    name: 'Peter Muster',
    zip: 1234,
  },
  reference: '21 00000 00003 13947 14300 09017',
}

export function createQrBill() {
  const qrBill = new SwissQRBill(data)

  qrBill.toString()
  writeFileSync('qr-bill.svg', qrBill.toString())
  // const stream1 = createReadStream('invoice.pdf')
  // pdf.text(stream1)

  // const stream = createWriteStream('qr-bill.pdf')

  // qrBill.attachTo(pdf)
  // pdf.pipe(stream)
  // pdf.end()
}
