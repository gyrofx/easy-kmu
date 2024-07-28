// import type { CreateInvoice } from '@easy-kmu/common'
import type { CreateInvoice } from '@/common/invoice/CreateInvoice'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { sum } from 'lodash'
import { marked } from 'marked'

import type { CreateInvoice as CreateInvoiceFull, HtmlToPdf } from '@easy-kmu/common'

import { renderToStaticMarkup } from 'react-dom/server'
import { readFile } from 'node:fs/promises'
import { SwissQRBill } from 'swissqrbill/svg'

export async function invoiceToHtml(invoice: CreateInvoice): Promise<HtmlToPdf> {
  const preparedInvoice = await enrichInvoice(invoice)
  const html = renderToStaticMarkup(await quoteTemplate(preparedInvoice))
  const doc = `<!doctype html>${html}`
  const css = await readFile('src/server/templates/invoice.css', 'utf-8')
  const signature = await readFile('src/server/templates/signature.jpg', 'binary')

  return {
    entryFilePath: 'index.html',
    files: [
      { path: 'index.html', content: doc, contentType: 'text' },
      { path: 'invoice.css', content: css, contentType: 'text' },
      {
        path: 'signature.jpg',
        content: Buffer.from(signature).toString('base64'),
        contentType: 'binary',
      },
    ],
  }
}

async function quoteTemplate(invoice: CreateInvoiceFull) {
  const { to, date, quote, project, items, total, textAfterTotal } = invoice
  const qrBillSvg = new SwissQRBill(invoice.qrbill).toString()

  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <link href="invoice.css" media="print" rel="stylesheet" />
        <link href="invoice.css" rel="stylesheet" />
        <link href="common/roboto/400.css" rel="stylesheet" />
        <link href="common/roboto-slab/300.css" rel="stylesheet" />

        <title>Offerte</title>
        <meta name="description" content="Offerte Stoop Metallbau" />
      </head>

      <body>
        <section id="invoice">
          <div className="title">Stoop Metallbau</div>
          <div className="company">
            <div className="row">
              <div>STOOP METALLBAU AG</div>
            </div>
            <div className="row">
              <div>Huebwisstrasse 11</div>
              <div>8117 Fällanden</div>
            </div>
            <div className="row">
              <div>Tel 044 826 00 44</div>
              <div>Fax 044 826 06 44</div>
            </div>
            <div className="row">
              <div>Zürher Kantonalbank</div>
              <div>8010 Zürich</div>
            </div>
            <div className="row">
              <div>MWST</div>
              <div>CHE-110.423.236 MWST</div>
            </div>
            <div className="row">
              <div>E-Mail</div>
              <div className="lowercase">
                <a href="mailto:stoop@stoopmetallbau.ch">stoop@stoopmetallbau.ch</a>
              </div>
            </div>
            <div className="row">
              <div>Homepage</div>
              <div className="lowercase">
                <a href="https://stoop@stoopmetallbau.ch">www.stoopmetallbau.ch</a>
              </div>
            </div>
          </div>

          <div className="to-address">
            <div>{to.name}</div>
            <div>{to.address}</div>
            <div>
              {to.zip} {to.city}
            </div>
          </div>

          <div className="date">
            <div>Fällanden, {date}</div>
          </div>

          <h2>Offerte {quote.id}</h2>
          <hr />
          <p>
            Wir danken Ihnen für Ihre Anfrage, und gestatten uns, Ihnen nachstehende Offerte zu
            unterbreiten.
          </p>

          <div className="project">
            {project.map(({ key, value }) => (
              <div key={key} className="row">
                <div className="key">
                  <div>
                    <strong>{key}</strong>
                  </div>
                </div>
                <div className="value">{value}</div>
              </div>
            ))}
          </div>

          <div className="items">
            {items.map(({ pos, text, price }, index) => (
              <div key={pos} className="row">
                <div className="item">
                  <strong>
                    Pos. {index} - {pos}
                  </strong>
                  <div className="markdown" dangerouslySetInnerHTML={{ __html: text }} />
                </div>
                <div className="price">{price}</div>
              </div>
            ))}
          </div>

          <div className="summary">
            <div className="row">
              <div>Total</div>
              <div>{total.subtotal}</div>
            </div>
            <div className="row">
              <div>+ MWSt 8.1%</div>
              <div>{total.mwst}</div>
            </div>
            <div className="row total">
              <div>Rechnungsbetrag, netto</div>
              <div className="border-top">{total.total}</div>
            </div>
          </div>

          {textAfterTotal.map((text, index) => (
            <div
              key={index}
              className="markdown no-break-inside"
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}

          <div className="footer">
            <div className="conditions">
              <div>
                <strong>Konditionen:</strong>
              </div>
              <div>30 Tage netto, inkl. MWSt 8.1%</div>
              <div>Bitte verwenden Sie den beiliegenden EZS mit der ESR-Nummer.</div>
              <div>Ungerechtfertigte Abzüge werden nachbelastet.</div>
              <div>IBAN CH97 0483 5062 2988 0100 0</div>
              <div>Besten Dank für Ihren Auftrag.</div>
            </div>
            <div className="signature">
              <div>Freundliche Grüsse</div>
              <img src="signature.jpg" aria-label="signature" />
            </div>
          </div>
        </section>

        <section id="qrbill">
          <div className="qrcode" dangerouslySetInnerHTML={{ __html: qrBillSvg }} />
        </section>
      </body>
    </html>
  )
}

async function enrichInvoice(invoice: CreateInvoice) {
  const subtotal = sum(invoice.items.map((item) => item.price))
  const mwst = subtotal * 0.081
  const total = subtotal + mwst

  // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
  const fullInvoice: CreateInvoiceFull = {
    ...invoice,
    date: format(new Date(), 'PP', { locale: de }),
    quote: { id: invoice.invoiceNumber },
    project: invoice.project.map((project) => ({
      key: project[0],
      value: project[1],
    })),
    items: await Promise.all(
      invoice.items.map(async (item) => ({
        ...item,
        price: toChf(item.price),
        text: await marked.parse(item.text),
      })),
    ),
    total: {
      subtotal: toChf(subtotal),
      mwst: toChf(mwst),
      total: toChf(total),
    },
    textAfterTotal: await Promise.all(
      invoice.snippets.map(async (snippet) => await marked.parse(snippet.text)),
    ),
    qrbill: {
      amount: total,
      creditor: {
        account: 'CH44 3199 9123 0008 8901 2',
        address: 'Musterstrasse',
        buildingNumber: 7,
        city: 'Musterstadt',
        country: 'CH',
        name: 'SwissQRBill',
        zip: '1234',
      },
      currency: 'CHF',
      debtor: {
        address: invoice.to.address,
        buildingNumber: '',
        city: invoice.to.city,
        country: 'CH',
        name: invoice.to.name,
        zip: invoice.to.zip,
      },
      reference: '21 00000 00003 13947 14300 09017',
    },
  }

  return fullInvoice
}

function toChf(amount: number) {
  return `Fr. ${amount.toFixed(2)}`
}
