import { db } from '@/server/db/db'
import { contacts } from '@/server/db/schema'
import { eq } from 'drizzle-orm'

export function deleteContact(id: string) {
  return db().delete(contacts).where(eq(contacts.id, id))
}
