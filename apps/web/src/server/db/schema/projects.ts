import { contacts, type SelectContact } from '@/server/db/schema/contacts'
import { projectObjects, type SelectProjectObject } from './projectObjects'
import { invoices } from './invoices'
import { quotes } from './quotes'
import { employees, type SelectEmployee } from './employees'
import { relations, sql, type InferSelectModel } from 'drizzle-orm'
import { pgEnum, pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const projectState = pgEnum('projectState', ['draft', 'offerd', 'rejected', 'accepted', 'done'])

export const projects = pgTable('project', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  projectNumber: integer('projectNumber').generatedAlwaysAsIdentity({ startWith: 1000 }),
  state: projectState('state').notNull().default('draft'),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  notes: text('notes').notNull().default(''),
  customerReference: text('customerReference').notNull().default(''),
  customerContactId: text('customerContactId').references(() => contacts.id),
  objectId: text('objectId').references(() => projectObjects.id),
  constructionManagementContactId: text('constructionManagementContactId').references(() => contacts.id),
  architectContactId: text('architectContactId').references(() => contacts.id),
  builderContactId: text('builderContactId').references(() => contacts.id),

  material: text('material').notNull().default(''),
  assembly: text('assembly').notNull().default(''),
  surface: text('surface').notNull().default(''),
  surfaceColor: text('surfaceColor').notNull().default(''),
  fireProtection: boolean('fireProtection').notNull().default(false),
  fireProtectionOption: text('fireProtectionOption').notNull().default(''),
  en1090: boolean('en1090').notNull().default(false),
  en1090Option: text('en1090Option').notNull().default(''),
  clerkEmployeeId: text('clerkEmployeeId')
    .references(() => employees.id)
    .notNull(),
  projectManagerEmployeeId: text('projectManagerEmployeeId')
    .references(() => employees.id)
    .notNull(),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectProject = InferSelectModel<typeof projects> & {
  object: SelectProjectObject | null
  customer: SelectContact | null
  constructionManagement: SelectContact | null
  architect: SelectContact | null
  builder: SelectContact | null
  clerk: SelectEmployee
  projectManager: SelectEmployee
}

export const projectRelations = relations(projects, ({ one, many }) => ({
  customer: one(contacts, {
    relationName: 'customers',
    fields: [projects.customerContactId],
    references: [contacts.id],
  }),
  object: one(projectObjects, {
    relationName: 'ProjectObjectToProject',
    fields: [projects.objectId],
    references: [projectObjects.id],
  }),
  constructionManagement: one(contacts, {
    relationName: 'constructionManagements',
    fields: [projects.constructionManagementContactId],
    references: [contacts.id],
  }),
  architect: one(contacts, {
    relationName: 'architects',
    fields: [projects.architectContactId],
    references: [contacts.id],
  }),
  builder: one(contacts, {
    relationName: 'builders',
    fields: [projects.builderContactId],
    references: [contacts.id],
  }),
  clerk: one(employees, {
    relationName: 'projectClerkToEmployee',
    fields: [projects.clerkEmployeeId],
    references: [employees.id],
  }),
  projectManager: one(employees, {
    relationName: 'projectManagerToEmployee',
    fields: [projects.projectManagerEmployeeId],
    references: [employees.id],
  }),
  quotes: many(quotes, {
    relationName: 'qutoesToProject',
  }),
  invoices: many(invoices, {
    relationName: 'invoicesToProject',
  }),
}))
