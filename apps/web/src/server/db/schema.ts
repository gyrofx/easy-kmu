import { type InferSelectModel, relations, sql } from 'drizzle-orm'
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

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

export const projectObjects = pgTable('projectObject', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  address: text('address').notNull(),
  zipCode: text('zipCode').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull().default(''),
  floor: text('floor').notNull().default(''),
  type: text('type').notNull().default(''),
  appartement: text('appartement').notNull().default(''),
  workshopOrder: text('workshopOrder').notNull().default(''),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectProjectObject = typeof projectObjects.$inferSelect

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

export const projectObjectRelations = relations(projectObjects, ({ many }) => ({
  projects: many(projects, {
    relationName: 'ProjectObjectToProject',
  }),
}))

export const employeesRelations = relations(employees, ({ many }) => ({
  projectClerks: many(projects, {
    relationName: 'projectClerkToEmployee',
  }),
  projectManagers: many(projects, {
    relationName: 'projectManagerToEmployee',
  }),
}))

export const quoteRelations = relations(quotes, ({ one }) => ({
  project: one(projects, {
    relationName: 'qutoesToProject',
    fields: [quotes.projectId],
    references: [projects.id],
  }),
}))

export const invoiceRelations = relations(invoices, ({ one }) => ({
  project: one(projects, {
    relationName: 'invoicesToProject',
    fields: [invoices.projectId],
    references: [projects.id],
  }),
}))
