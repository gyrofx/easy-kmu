import { db } from '@/server/db/db'
import { contacts } from '@/server/db/schema'
import { eq } from 'drizzle-orm'
import type { CreateOrUpdateContact } from '@/common/models/contact'
import { dbContactToContact } from '@/server/models/contact/db/dbContactToContact'

export async function createOrUpdateContact(contact: CreateOrUpdateContact) {
  const returning = contact.id
    ? await db().update(contacts).set(contact).where(eq(contacts.id, contact.id)).returning()
    : await db().insert(contacts).values(contact).returning()

  const updatedContact = returning[0]
  if (!updatedContact) throw new Error('No contact returned from insert or update')

  return dbContactToContact(updatedContact)
}
