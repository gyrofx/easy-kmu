import { produce } from 'immer'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IsoDateString, move } from '@easy-kmu/common'
import type { CreateOrUpdateQuote, Quote } from '@/common/models/quote'

interface QuoteState {
  quote: CreateOrUpdateQuote
  addDescriptionItem: () => void
  updateDescriptionItem: (index: number, item: { key: string; value: string }) => void
  removeDescriptionItem: (index: number) => void
  moveDescriptionItem: (fromIndex: number, toIndex: number) => void
  setTo: (value: string) => void
  addItem: () => void
  updateItem: (item: { pos: string; text: string; price: number }, index: number) => void
  removeItem: (index: number) => void
  moveItem: (fromIndex: number, toIndex: number) => void
  addTextblock: (value: string) => void
  removeTextblock: (index: number) => void
  updateTextblock: (value: string, index: number) => void
  moveTextblock: (fromIndex: number, toIndex: number) => void
  setDiscount: (type: 'amount' | 'percent', value: string) => void
  clearInvoice: () => void
  setInitialQuote: (quote: Quote) => void
}

export const useQuoteStore = create(
  persist<QuoteState>(
    (set) => ({
      quote: emptyQuote(),

      setTo: (value: string) =>
        set(
          produce((state: QuoteState) => {
            state.quote.to = value
          }),
        ),

      addDescriptionItem: () =>
        set(
          produce((state: QuoteState) => {
            state.quote.description.push({ key: 'Neu', value: '' })
          }),
        ),
      updateDescriptionItem: (index: number, item: { key: string; value: string }) =>
        set(
          produce((state: QuoteState) => {
            state.quote.description[index] = item
          }),
        ),

      removeDescriptionItem: (index: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.description = state.quote.description.filter((_, i) => i !== index)
          }),
        ),
      moveDescriptionItem: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.description = move(state.quote.description, fromIndex, toIndex)
          }),
        ),

      addItem: () =>
        set(
          produce((state: QuoteState) => void state.quote.items.push({ pos: '', text: '', price: 0.0 })),
        ),
      updateItem: (item: { pos: string; text: string; price: number }, index: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.items[index] = item
            state.quote.total.subtotal = state.quote.items.reduce((acc, item) => acc + item.price, 0)
            state.quote.total.mwst = state.quote.total.subtotal * 0.081
            state.quote.total.total = state.quote.total.subtotal + state.quote.total.mwst
          }),
        ),
      removeItem: (index: number) =>
        set(produce((state: QuoteState) => void state.quote.items.splice(index, 1))),
      moveItem: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.items = move(state.quote.items, fromIndex, toIndex)
          }),
        ),
      addTextblock: (value: string) =>
        set(produce((state: QuoteState) => void state.quote.textBlocks.push(value))),
      updateTextblock: (value: string, index: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.textBlocks[index] = value
          }),
        ),
      removeTextblock: (index: number) =>
        set(produce((state: QuoteState) => void state.quote.textBlocks.splice(index, 1))),

      moveTextblock: (fromIndex: number, toIndex: number) =>
        set(
          produce((state: QuoteState) => {
            state.quote.textBlocks = move(state.quote.textBlocks, fromIndex, toIndex)
          }),
        ),
      setDiscount: (type: 'amount' | 'percent', value: string) =>
        set(
          produce((state: QuoteState) => {
            const numberValue = Number.parseFloat(value) || 0

            console.log('discount', type, value, numberValue, typeof value)

            const amount =
              type === 'amount' ? numberValue || 0 : (state.quote.total.subtotal * numberValue) / 100
            const percent = type === 'percent' ? numberValue : numberValue / state.quote.total.subtotal
            state.quote.total.discount = { type, amount, percent }
            state.quote.total.mwst = (state.quote.total.subtotal - amount) * 0.081
            state.quote.total.total = state.quote.total.subtotal - amount + state.quote.total.mwst
          }),
        ),
      clearInvoice: () => set({ quote: emptyQuote() }),
      setInitialQuote: (quote: Quote) => set({ quote }),
    }),
    { name: 'quote-store' },
  ),
)

function emptyQuote(): CreateOrUpdateQuote {
  return {
    projectId: '',
    quoteNumber: 0,
    date: IsoDateString(new Date()),
    state: 'draft',
    description: [
      { key: 'Projekt', value: '' },
      { key: 'Objekt', value: '' },
      { key: 'Kontakt', value: '' },
    ],
    to: '',
    items: [],
    total: {
      subtotal: 0,
      mwst: 0,
      total: 0,
      discount: { type: 'percent', percent: 0, amount: 0 },
      earlyPaymentDiscount: { type: 'percent', percent: 0, amount: 0 },
    },
    textBlocks: [],
    notes: '',
  }
}
