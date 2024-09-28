import { projects } from '@/server/db/schema/projects'
import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const contacts = pgTable('contact', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  salutation: text('salutation').notNull().default(''),
  gender: text('gender').notNull().default(''),
  company: text('company').notNull().default(''),
  firstName: text('firstName').notNull().default(''),
  lastName: text('lastName').notNull().default(''),
  additional1: text('additional1').notNull().default(''),
  additional2: text('additional2').notNull().default(''),
  address: text('address').notNull(),
  zipCode: text('zipCode').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull().default(''),
  pobox: text('pobox').notNull().default(''),
  phone1: text('phone1').notNull().default(''),
  phone2: text('phone2').notNull().default(''),
  email: text('email').notNull().default(''),
  web: text('web').notNull().default(''),
  notes: text('notes').notNull().default(''),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectContact = typeof contacts.$inferSelect

export const contactRelations = relations(contacts, ({ many }) => ({
  customers: many(projects, {
    relationName: 'customers',
  }),
  constructionManagements: many(projects, {
    relationName: 'constructionManagements',
  }),
  architects: many(projects, {
    relationName: 'architects',
  }),
  builders: many(projects, {
    relationName: 'builders',
  }),
}))
