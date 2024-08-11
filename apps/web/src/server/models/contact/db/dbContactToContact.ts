import { IsoDateString, zodParse } from '@easy-kmu/common'
import type { SelectContact } from '@/server/db/schema'
import { zodPersons, type Contact } from '@/common/models/contact'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'

export function dbContactToContact(dbContact: SelectContact): Contact {
  return nullsToUndefined({
    ...dbContact,
    persons: zodParse(zodPersons, dbContact.persons),
    createdAt: IsoDateString(dbContact.createdAt),
    updatedAt: IsoDateString(dbContact.updatedAt),
  })
}
