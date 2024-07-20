import { prisma } from '@/server/db/prisma'

export function deleteContact(id: string) {
  return prisma().contact.delete({
    where: { id },
  })
}
