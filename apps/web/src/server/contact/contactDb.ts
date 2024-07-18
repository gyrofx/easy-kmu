import type { Contact } from '@/common/contact/contact'
import { prisma } from '@/server/db/prisma'

export async function readContacts(): Promise<Contact[]> {
  return (
    await prisma().contact.findMany({
      include: {
        persons: true,
      },
    })
  ).map(nullsToUndefined)
}

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

export function deleteContact(id: string) {
  return prisma().contact.delete({
    where: { id },
  })
}

type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends (infer U)[]
    ? RecursivelyReplaceNullWithUndefined<U>[]
    : T extends Record<string, unknown>
      ? { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }
      : T

export function nullsToUndefined<T>(obj: T): RecursivelyReplaceNullWithUndefined<T> {
  if (obj === null || obj === undefined) {
    return undefined as any
  }

  if ((obj as any).constructor.name === 'Object' || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any
    }
  }
  return obj as any
}
