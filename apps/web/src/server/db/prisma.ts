import { PrismaClient } from '@prisma/client'

export function initPrisma() {
  if (prismaInternal) throw new Error('Prisma already initialized')
  prismaInternal = new PrismaClient()
}

export function prisma() {
  if (!prismaInternal) throw new Error('Prisma not initialized')
  return prismaInternal
}

let prismaInternal: PrismaClient | undefined
