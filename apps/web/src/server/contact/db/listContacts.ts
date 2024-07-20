import type { Contact } from '@/common/contact/contact'
import { nullsToUndefined } from '@/server/contact/db/nullsToUndefined'
import { prisma } from '@/server/db/prisma'

export async function listContacts(): Promise<Contact[]> {
  return (
    await prisma().contact.findMany({
      include: {
        persons: true,
      },
    })
  ).map(nullsToUndefined)
}
