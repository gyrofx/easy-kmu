import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { sum } from 'lodash'
import { marked } from 'marked'

import type { HtmlToPdf } from '@easy-kmu/common'

import { renderToStaticMarkup } from 'react-dom/server'
import { readFile } from 'node:fs/promises'
import { toChf } from '@/common/utils/toChf'
import type { Quote } from '@/common/models/quote'
import type { Project } from '@/common/models/project'

export async function quoteToHtml(quote: Quote, project: Project): Promise<HtmlToPdf> {
  const currentPreparedInvoice = await preparedQuote(quote, project)
  const html = renderToStaticMarkup(await quoteTemplate(currentPreparedInvoice))
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

async function quoteTemplate(quote: PreparedQuote) {
  const { to, date, quoteNumber, description, items, total, textBlocks } = quote

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
            <div>{to}</div>
          </div>

          <div className="date">
            <div>Fällanden, {date}</div>
          </div>

          <h2>Offerte {quoteNumber}</h2>
          <hr />
          <p>
            Wir danken Ihnen für Ihre Anfrage, und gestatten uns, Ihnen nachstehende Offerte zu
            unterbreiten.
          </p>

          <div className="project">
            {description.map(({ key, value }) => (
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

          {textBlocks.map((text, index) => (
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
      </body>
    </html>
  )
}

async function preparedQuote(quote: Quote, project: Project): Promise<PreparedQuote> {
  const subtotal = sum(quote.items.map((item) => item.price))
  // const earlyPaymentDiscount = quote.earlyPaymentDiscount
  //   ? quote.earlyPaymentDiscount.type === 'percent'
  //     ? {
  //         amount: subtotal * quote.earlyPaymentDiscount.value,
  //         percent: quote.earlyPaymentDiscount.value,
  //       }
  //     : {
  //         amount: quote.earlyPaymentDiscount.value,
  //         percent: quote.earlyPaymentDiscount.value / subtotal,
  //       }
  //   : undefined
  const discount = quote.total.discount
    ? quote.total.discount.type === 'percent'
      ? { amount: subtotal * quote.total.discount.value, percent: quote.total.discount.value }
      : { amount: quote.total.discount.value, percent: quote.total.discount.value / subtotal }
    : undefined
  const subtotalAfterDiscount = subtotal - (discount?.amount ?? 0) //- (earlyPaymentDiscount?.amount ?? 0)
  const mwst = subtotalAfterDiscount * 0.081
  const total = subtotalAfterDiscount + mwst

  console.log('preparedQuote', quote, total, mwst, subtotalAfterDiscount)

  return {
    ...quote,
    date: format(new Date(), 'PP', { locale: de }),
    quoteNumber: `${project.projectNumber}-${quote.quoteNumber}`,

    items: await Promise.all(
      quote.items.map(async (item) => ({
        ...item,
        price: toChf(item.price),
        text: await marked.parse(item.text),
      })),
    ),
    total: {
      subtotal: toChf(subtotal),
      // earlyPaymentDiscount: earlyPaymentDiscount
      //   ? {
      //       amount: toChf(earlyPaymentDiscount.amount),
      //       percent: earlyPaymentDiscount.percent.toString(),
      //     }
      //   : undefined,
      earlyPaymentDiscount: undefined,
      discount: discount
        ? { amount: toChf(discount.amount), percent: discount.percent.toString() }
        : undefined,
      mwst: toChf(mwst),
      total: toChf(total),
    },
    textBlocks: await Promise.all(quote.textBlocks.map(async (text) => await marked.parse(text))),
  }
}

interface PreparedQuote {
  to: string
  date: string
  quoteNumber: string
  description: Array<{ key: string; value: string }>
  items: Array<{ pos: string; text: string; price: string }>
  total: {
    subtotal: string
    mwst: string
    total: string
    discount: { amount: string; percent: string } | undefined
    earlyPaymentDiscount: { amount: string; percent: string } | undefined
  }
  textBlocks: string[]
}
