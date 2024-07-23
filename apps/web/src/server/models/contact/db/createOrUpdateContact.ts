import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { db } from '@/server/db/db'
import { contacts } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import type { Contact } from '@/common/models/contact'

export async function createOrUpdateContact(contact: Contact) {
  const { updatedAt, createdAt, ...rest } = contact
  if (rest.id) {
    return await db().update(contacts).set(rest).where(eq(contacts.id, rest.id)).returning()
  }
  return nullsToUndefined(await db().insert(contacts).values(rest).returning())
}
