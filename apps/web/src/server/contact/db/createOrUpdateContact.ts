import type { Contact } from '@/common/contact/contact'
import { nullsToUndefined } from '@/server/contact/db/nullsToUndefined'
import { prisma } from '@/server/db/prisma'

export async function createOrUpdateContact(contact: Contact) {
  const { updatedAt, createdAt, ...rest } = contact
  if (rest.id) {
    return prisma().contact.update({
      where: { id: rest.id },
      data: rest,
    })
  }

  return nullsToUndefined(
    await prisma().contact.create({
      data: rest,
    }),
  )
}
