import { projects } from '@/server/db/schema/projects'
import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const employees = pgTable('employee', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  phone1: text('phone1').notNull().default(''),
  phone2: text('phone2').notNull().default(''),
  email: text('email').notNull().default(''),

  notes: text('notes').notNull().default(''),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectEmployee = typeof employees.$inferSelect

export const employeeRelations = relations(employees, ({ many }) => ({
  projectClerks: many(projects, {
    relationName: 'projectClerkToEmployee',
  }),
  projectManagers: many(projects, {
    relationName: 'projectManagerToEmployee',
  }),
}))
