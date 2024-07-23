import type { CreateOrUpdateContact, Person } from '@/common/models/contact'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
import { move } from '@easy-kmu/common'

type ContactKeys = keyof CreateOrUpdateContact

interface ContactState {
  contact: CreateOrUpdateContact
  setInitialContact: (contact: CreateOrUpdateContact) => void
  setValue: (key: ContactKeys, value: string | undefined) => void

  addPerson: () => void
  removePerson: (index: number) => void
  movePerson: (from: number, to: number) => void
  setPersonValue: (index: number, key: keyof Person, value: string) => void

  clear: () => void
}

export const useContactStore = create(
  persist<ContactState>(
    (set) => ({
      contact: emptyContact(),
      setInitialContact: (contact: CreateOrUpdateContact) => set((state) => ({ ...state, contact })),
      setValue: (key: ContactKeys, value: string | undefined) =>
        set((state) => ({ ...state, contact: { ...state.contact, [key]: value } })),
      addPerson: () =>
        set((state) =>
          produce(state, (draft) => {
            draft.contact.persons.push({
              name: '',
              role: '',
              email: '',
              phone1: '',
              phone2: '',
              notes: '',
            })
          }),
        ),
      setPersonValue: (index: number, key: keyof Person, value: string) => {
        set((state) =>
          produce(state, (draft) => {
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            if (index < draft.contact.persons.length) draft.contact.persons[index]![key] = value
          }),
        )
      },

      removePerson: (index: number) =>
        set((state) =>
          produce(state, (draft) => {
            draft.contact.persons.splice(index, 1)
          }),
        ),
      movePerson: (from: number, to: number) =>
        set((state) =>
          produce(state, (draft) => {
            draft.contact.persons = move(draft.contact.persons, from, to)
          }),
        ),
      clear: () => set((state) => ({ ...state, contact: emptyContact() })),
    }),
    {
      name: 'new-contact-store',
      // storage: createJSONStorage(() => localStorage),
    },
  ),
)

function emptyContact(): CreateOrUpdateContact {
  return {
    salutation: '',
    gender: '',

    firstName: '',
    lastName: '',
    additional1: '',
    additional2: '',
    address: '',
    zipCode: '',
    city: '',
    company: '',
    pobox: '',
    country: '',

    notes: '',

    persons: [],
  }
}
