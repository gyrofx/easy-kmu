import { projects } from '@/server/db/schema/projects'
import { relations, sql } from 'drizzle-orm'
import { pgEnum, pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const invoiceState = pgEnum('invoiceState', ['draft', 'sent', 'rejected', 'canceled', 'payed'])

export const invoices = pgTable('invoices', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  quoteNumber: text('invoiceNumber').notNull().unique(),
  projectId: text('projectId')
    .notNull()
    .references(() => projects.id),

  state: invoiceState('state').notNull().default('draft'),
  data: jsonb('data').notNull(),

  notes: text('notes').notNull().default(''),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export const invoiceRelations = relations(invoices, ({ one }) => ({
  project: one(projects, {
    relationName: 'invoicesToProject',
    fields: [invoices.projectId],
    references: [projects.id],
  }),
}))
