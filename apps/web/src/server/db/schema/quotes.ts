import { projects } from '@/server/db/schema/projects'
import { relations, sql } from 'drizzle-orm'
import { pgEnum, pgTable, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core'

export const quoteState = pgEnum('quoteState', [
  'draft',
  'readyToOffer',
  'offerd',
  'rejected',
  'accepted',
])

export const quotes = pgTable('quotes', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: integer('quoteNumber').notNull(),
  projectId: text('projectId')
    .notNull()
    .references(() => projects.id),

  date: timestamp('date').notNull().defaultNow(),
  state: quoteState('state').notNull().default('draft'),
  data: jsonb('data').notNull(),

  filePath: text('filePath'),

  notes: text('notes').notNull().default(''),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectQuote = typeof quotes.$inferSelect

export const quoteRelations = relations(quotes, ({ one }) => ({
  project: one(projects, {
    relationName: 'qutoesToProject',
    fields: [quotes.projectId],
    references: [projects.id],
  }),
}))
