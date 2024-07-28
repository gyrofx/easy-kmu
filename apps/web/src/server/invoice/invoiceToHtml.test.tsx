import type { CreateInvoice } from '@/common/invoice/CreateInvoice'
import { invoiceToHtml } from '@/server/invoice/invoiceToHtml'

describe('invoiceToHtml', () => {
  test('should render invoice to html', () => {
    const invoice: CreateInvoice = {
      invoiceNumber: '0069-1',
      project: [
        ['Projekt', 'Kellertreppe'],
        ['Objekt', 'RFH, Rehalpstrasse 92, 8008 Zürich,'],
        ['Besteller', 'Frau und Herr Eichenberger (am 19.10.2015)'],
      ],
      to: {
        company: 'gggg',
        name: 'Felix Eichenberger',
        address: 'Rehalptrasse 92',
        city: 'Zürich',
        state: '',
        zip: '8008',
      },
      items: [
        {
          text: 'Bestehende Holzkellertreppe demontieren, abführen und entsorgen\n\nNeue Kellertreppe gemäss Besprechung und Plänen bestehend aus zwei gelaserten Stahlwangen 8 mm, angeschweisste Trittauflager,\n11 Holzstufen aus Buche geölt, auf der rechten Seite ein Geländer mit vertikalen Rundstaketen, CNS-Handlauf mit zweifachem Richtungswechsel, Montage mittels Bolzenanker in Mauerwerk \n\nMasse:\nca. 2850 x 870 x 2330 mm (Treppe)\nca. 2000 x 1050 mm (Geländer)\n\nOberfläche:\n* Stahlteile in VAG E5 - Eisenglimmer\n* CNS geschliffen\n* Holzstufen geölt',
          pos: 'Umbau: Ersatz Kellertreppe',
          price: 5000,
        },
      ],
      snippets: [
        {
          label: 'Bauseitige Leistungen',
          text: '**Bauseitige Leistungen:**\n\n* Baustatik und Bauphysik\n* Koordination Bauherrschaft\n* Spitz- und Maurerarbeiten\n\nFreiräumen der Arbeitszonen\n\nSchlussreinigung nach Montage\n\nAnpassung Bodenbeläge\n\nGipser- und Malerarbeiten',
        },
        {
          label: 'Vorsicht',
          text: '**Bemerkungen:**\n\nTrotz grösster Vorsicht beim bohren der Montagelöcher, kann es zu kleinen Mauerausbrüchen kommen. Diese müssten bauseitig ausgebessert werden. Das obere durchlaufende Verstärkungsrohr ist mit einer Bauhöhe von 20 mm eingeplant. Bei einer grossen Gewichtsbelastung des Tablars, kann es trotzdem zu einer sichtbaren Durchbiegung kommen. Bei den verschliffenen Schweissstellen, können je nach Lichteinfall, leichte Unebenheiten in der Oberfläche wahrgenommen werden.',
        },
        {
          label: 'Lieferfrist',
          text: '**Lieferfrist::**\n\nNach Absprache (ca. 5-6 Arbeitswochen ab Plangenehmigung)\n\n<span style="color:red">**Unsere Weihnachtsferien sind in der KW 52 + KW 01.**<span />',
        },
        {
          label: 'Vorbehalt Preisaufschläge',
          text: '**Vorbehalt Preisaufschläge / Verfügbarkeit:**\n\nAngebot freibleibend gültig. Verfügbarkeiten und Preise können sich jederzeit ändern. Aufgrund der aktuellen Marktsituation, muss mit Preisaufschlägen und längeren Lieferfristen gerechnet werden.',
        },
      ],
    }

    expect(invoiceToHtml(invoice)).toBe('<div class="foo">content</div>')
  })
})
