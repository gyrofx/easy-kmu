import { files, type SelectFile } from '@/server/db/schema/files'
import { projects } from '@/server/db/schema/projects'
import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const tasks = pgTable('tasks', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  projectId: text('projectId')
    .notNull()
    .references(() => projects.id),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  notes: text('notes').notNull().default(''),

  cardFileId: text('cardFileId').references(() => files.id),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectTask = typeof tasks.$inferSelect & {
  cardFile: SelectFile | null
}

export const taskRelations = relations(tasks, ({ one }) => ({
  cardFile: one(files, {
    relationName: 'cardFileIdToFile',
    fields: [tasks.cardFileId],
    references: [files.id],
  }),
}))
