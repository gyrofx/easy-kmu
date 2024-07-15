import { execSync } from 'node:child_process'
import { compile } from 'handlebars'
import { copyFile, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { marked } from 'marked'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { SwissQRBill } from 'swissqrbill/svg'
import { join, resolve } from 'node:path'
import type { CreateInvoice } from '@easy-kmu/common'
import { existsSync } from 'node:fs'

export const copyDirectory = async (src: string, dest: string) => {
  const [entries] = await Promise.all([
    readdir(src, { withFileTypes: true }),
    mkdir(dest, { recursive: true }),
  ])

  await Promise.all(
    entries.map((entry) => {
      const srcPath = join(src, entry.name)
      const destPath = join(dest, entry.name)
      return entry.isDirectory() ? copyDirectory(srcPath, destPath) : copyFile(srcPath, destPath)
    }),
  )
}

export async function createInvoice(data: CreateInvoice) {
  if (existsSync('/tmp/templates')) {
    await rm('/tmp/templates', { recursive: true })
  }

  await mkdir('/tmp/templates', { recursive: true })
  await copyDirectory('./templates', '/tmp/templates')

  const rawHtml = await readFile('/tmp/templates/invoice/index.html', 'utf8')
  const template = compile(rawHtml)

  // const qrBillData: CreateQrBill = {
  // 	amount: 1994.75,
  // 	creditor: {
  // 		account: "CH44 3199 9123 0008 8901 2",
  // 		address: "Musterstrasse",
  // 		buildingNumber: 7,
  // 		city: "Musterstadt",
  // 		country: "CH",
  // 		name: "SwissQRBill",
  // 		zip: 1234,
  // 	},
  // 	currency: "CHF" as const,
  // 	debtor: {
  // 		address: "Musterstrasse",
  // 		buildingNumber: 1,
  // 		city: "Musterstadt",
  // 		country: "CH",
  // 		name: "Peter Muster",
  // 		zip: 1234,
  // 	},
  // 	reference: "21 00000 00003 13947 14300 09017",
  // };

  // const qrBill = new SwissQRBill(qrBillData);

  // await writeFile("./templates/invoice/qr.svg", qrBill.toString());
  const qrBillSvg = new SwissQRBill(data.qrbill).toString()
  // console.log(qrBillSvg);
  const html = template({
    ...data,
    items: await Promise.all(
      data.items.map(async (item) => ({
        ...item,
        text: await marked(item.text),
      })),
    ),
    textAfterTotal: await Promise.all(data.textAfterTotal.map(async (text) => await marked(text))),
    qrBillSvg,
  })

  await writeFile('/tmp/templates/invoice/compiled.html', html)

  execSync(
    'node ./node_modules/.bin/pagedjs-cli --browserArgs "--no-sandbox" /tmp/templates/invoice/compiled.html -o /tmp/index.pdf',
  )

  // const pdf = await readFile("./index.pdf");
  // return pdf.toString("base64");
  return resolve('/tmp/index.pdf')
}

export async function createInvoiceTest() {
  const rawHtml = await readFile('./templates/invoice/index.html', 'utf8')
  const template = compile(rawHtml)

  // await writeFile("./templates/invoice/qr.svg", qrBill.toString());

  const data: CreateInvoice = {
    to: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      zip: '62701',
    },
    date: format(new Date(), 'PP', { locale: de }),
    quote: { id: '0065' },

    project: [
      { key: 'Projekt', value: 'Regal-Gestell bei Wohnzimmer zu Küche' },
      { key: 'Objekt', value: 'REFH, Rehalpstrasse 92, 8008 Zürich' },
      {
        key: 'I/Kontakt:',
        value: 'Herr Felix Eichenberger (078 759 29 88 / felix.eichenberg@gmail.com)',
      },
      {
        key: '',
        value: 'Bitte zuerst anrufen',
      },
    ],

    items: [
      {
        pos: 'Regal-Gestell bei Wohnzimmer zu Küche',
        text: await marked.parse(
          'Neues Regal-Gestell gemäss Besprechung vor Ort bestehend aus gelaserten 4 mm Stahlblechen, oberstes Tablar von links nach echts durchlaufend, mit mittigem Verstärkungsrohr 20/20/3.0 mm, links 7 Stk. Tablare mit zwei Winkelprofilen als vertikale Eckstützen, rechts 7 Stk. Tablare mit vertikalem Abschlussblech, linkes und rechtes Tablarelement oben mit dem grossen Tablar verschraubt, Montage mittels angeschweissten Laschen und Dübeln in die Wände bzw. in den Fussboden, inkl. genaue Massaufnahme, Produktion, Lieferung und Montage\n\nMasse: ca. 1665 x 2300 x 180-220 mm\n\nOberfläche: Pulver in RAL 5014 - Taubenblau',
        ),
        price: 'Fr. 3123.00',
      },
      {
        pos: 'Regal-Gestell bei Wohnzimmer zu Küche',
        text: 'Neues Regal-Gestell gemäss Besprechung vor Ort bestehend aus gelaserten 4 mm Stahlblechen, oberstes Tablar von links nach echts durchlaufend, mit mittigem Verstärkungsrohr 20/20/3.0 mm, links 7 Stk. Tablare mit zwei Winkelprofilen als vertikale Eckstützen, rechts 7 Stk. Tablare mit vertikalem Abschlussblech, linkes und rechtes Tablarelement oben mit dem grossen Tablar verschraubt, Montage mittels angeschweissten Laschen und Dübeln in die Wände bzw. in den Fussboden, inkl. genaue Massaufnahme, Produktion, Lieferung und Montage Masse: ca. 1665 x 2300 x 180-220 mm Oberfläche: Pulver in RAL 5014 - Taubenblau',
        price: 'Fr. 3123.00',
      },
      {
        pos: 'Regal-Gestell bei Wohnzimmer zu Küche',
        text: 'Neues Regal-Gestell gemäss Besprechung vor Ort bestehend aus gelaserten 4 mm Stahlblechen, oberstes Tablar von links nach echts durchlaufend, mit mittigem Verstärkungsrohr 20/20/3.0 mm, links 7 Stk. Tablare mit zwei Winkelprofilen als vertikale Eckstützen, rechts 7 Stk. Tablare mit vertikalem Abschlussblech, linkes und rechtes Tablarelement oben mit dem grossen Tablar verschraubt, Montage mittels angeschweissten Laschen und Dübeln in die Wände bzw. in den Fussboden, inkl. genaue Massaufnahme, Produktion, Lieferung und Montage Masse: ca. 1665 x 2300 x 180-220 mm Oberfläche: Pulver in RAL 5014 - Taubenblau',
        price: 'Fr. 3123.00',
      },
      {
        pos: 'Regal-Gestell bei Wohnzimmer zu Küche',
        text: 'Neues Regal-Gestell gemäss Besprechung vor Ort bestehend aus gelaserten 4 mm Stahlblechen, oberstes Tablar von links nach echts durchlaufend, mit mittigem Verstärkungsrohr 20/20/3.0 mm, links 7 Stk. Tablare mit zwei Winkelprofilen als vertikale Eckstützen, rechts 7 Stk. Tablare mit vertikalem Abschlussblech, linkes und rechtes Tablarelement oben mit dem grossen Tablar verschraubt, Montage mittels angeschweissten Laschen und Dübeln in die Wände bzw. in den Fussboden, inkl. genaue Massaufnahme, Produktion, Lieferung und Montage Masse: ca. 1665 x 2300 x 180-220 mm Oberfläche: Pulver in RAL 5014 - Taubenblau',
        price: 'Fr. 3123.00',
      },
    ],
    total: {
      subtotal: "Fr. 30'000.00",
      mwst: 'Fr. 125.00',
      total: "Fr. 30'125.00",
    },
    textAfterTotal: [
      await marked.parse(
        '**Bemerkungen:**\n\nTrotz grösster Vorsicht beim bohren der Montagelöcher, kann es zu kleinen Mauerausbrüchen kommen. Diese müssten bauseitig ausgebessert werden. Das obere durchlaufende Verstärkungsrohr ist mit einer Bauhöhe von 20 mm eingeplant. Bei einer grossen Gewichtsbelastung des Tablars, kann es trotzdem zu einer sichtbaren Durchbiegung kommen. Bei den verschliffenen Schweissstellen, können je nach Lichteinfall, leichte Unebenheiten in der Oberfläche wahrgenommen werden.',
      ),
      await marked.parse(
        '**Bauseitige Leistungen:**\n\n* Baustatik und Bauphysik\n* Koordination Bauherrschaft\n* Spitz- und Maurerarbeiten\n\nFreiräumen der Arbeitszonen\n\nSchlussreinigung nach Montage\n\nAnpassung Bodenbeläge\n\nGipser- und Malerarbeiten',
      ),
      await marked.parse(
        '**Lieferfrist::**\n\nNach Absprache (ca. 5-6 Arbeitswochen ab Plangenehmigung)\n\n<span style="color:red">**Unsere Weihnachtsferien sind in der KW 52 + KW 01.**<span />',
      ),
      await marked.parse(
        '**Vorbehalt Preisaufschläge / Verfügbarkeit:**\n\nAngebot freibleibend gültig. Verfügbarkeiten und Preise können sich jederzeit ändern. Aufgrund der aktuellen Marktsituation, muss mit Preisaufschlägen und längeren Lieferfristen gerechnet werden.',
      ),
    ],
    qrbill: {
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
    },
  }

  const html = template({
    ...data,
    qrBillSVG: new SwissQRBill(data.qrbill).toString(),
  })

  await writeFile('./templates/invoice/compiled.html', html)

  execSync('node ./node_modules/.bin/pagedjs-cli ./templates/invoice/compiled.html -o ./index.pdf')

  return resolve('./index.pdf')
}
