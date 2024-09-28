import { IsoDateString } from '@easy-kmu/common'
import type { Contact } from '@/common/models/contact'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import type { SelectContact } from '@/server/db/schema/contacts'

export function dbContactToContact(dbContact: SelectContact): Contact {
  return nullsToUndefined({
    ...dbContact,
    createdAt: IsoDateString(dbContact.createdAt),
    updatedAt: IsoDateString(dbContact.updatedAt),
  })
}
