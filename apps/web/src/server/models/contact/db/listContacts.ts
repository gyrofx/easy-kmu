import type { Contact } from '@/common/models/contact'
import { db } from '@/server/db/db'
import type { SelectContact } from '@/server/db/schema/contacts'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { IsoDateString } from '@easy-kmu/common'

export async function listContacts(): Promise<Contact[]> {
  const contacts = await db().query.contacts.findMany()

  return contacts.map(dbContactToConact)
}

export function dbContactToConact(dbContact: SelectContact): Contact {
  return nullsToUndefined({
    ...dbContact,
    createdAt: IsoDateString(dbContact.createdAt),
    updatedAt: IsoDateString(dbContact.updatedAt),
  })
}
