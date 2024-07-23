import { zodPersons, type Contact, type ContactWithId } from '@/common/models/contact'
import { db } from '@/server/db/db'
import type { SelectContact } from '@/server/db/schema'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { IsoDateString, zodParse } from '@easy-kmu/common'

export async function listContacts(): Promise<Contact[]> {
  const contacts = await db().query.contacts.findMany()

  return contacts.map(dbContactToConact)
}

export function dbContactToConact(dbContact: SelectContact): ContactWithId {
  return nullsToUndefined({
    ...dbContact,
    persons: zodParse(zodPersons, dbContact.persons),
    createdAt: IsoDateString(dbContact.createdAt),
    updatedAt: IsoDateString(dbContact.updatedAt),
  })
}
