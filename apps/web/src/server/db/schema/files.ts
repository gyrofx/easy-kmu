import { sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const files = pgTable('files', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),

  path: text('path').notNull(),
  mimeType: text('mimeType').notNull(),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectFile = typeof files.$inferSelect
