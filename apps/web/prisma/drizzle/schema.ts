import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const Contact = pgTable('Contact', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	salutation: text('salutation'),
	gender: text('gender'),
	company: text('company'),
	firstName: text('firstName').notNull(),
	lastName: text('lastName').notNull(),
	additional1: text('additional1'),
	additional2: text('additional2'),
	address: text('address').notNull(),
	zipCode: text('zipCode').notNull(),
	city: text('city').notNull(),
	country: text('country'),
	pobox: text('pobox'),
	notes: text('notes'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow()
});

export const Person = pgTable('Person', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	name: text('name').notNull(),
	description: text('description'),
	phone1: text('phone1'),
	phone2: text('phone2'),
	fax: text('fax'),
	email: text('email'),
	website: text('website'),
	notes: text('notes'),
	contactId: text('contactId').notNull().references(() => Contact.id)
});

export const Project = pgTable('Project', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	name: text('name').notNull(),
	description: text('description').notNull(),
	notes: text('notes').notNull(),
	customerContactId: text('customerContactId').notNull().references(() => Contact.id),
	objectId: text('objectId').notNull().references(() => Object.id),
	constructionManagementContactId: text('constructionManagementContactId').notNull().references(() => Contact.id),
	architectContactId: text('architectContactId').notNull().references(() => Contact.id),
	builderContactId: text('builderContactId').notNull().references(() => Contact.id),
	material: text('material').notNull(),
	assembly: text('assembly').notNull(),
	surface: text('surface').notNull(),
	fireProtection: text('fireProtection').notNull(),
	en1090: text('en1090').notNull(),
	deadline: timestamp('deadline', { precision: 3 }).notNull().defaultNow(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow()
});

export const Object = pgTable('Object', {
	id: text('id').notNull().primaryKey().default(sql`uuid()`),
	address: text('address').notNull(),
	zipCode: text('zipCode').notNull(),
	city: text('city').notNull(),
	country: text('country').notNull(),
	floor: text('floor').notNull(),
	appartement: text('appartement').notNull(),
	workshopOrder: text('workshopOrder').notNull(),
	notes: text('notes').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow()
});

export const ContactRelations = relations(Contact, ({ many }) => ({
	persons: many(Person, {
		relationName: 'ContactToPerson'
	}),
	customers: many(Project, {
		relationName: 'customers'
	}),
	constructionManagements: many(Project, {
		relationName: 'constructionManagements'
	}),
	architects: many(Project, {
		relationName: 'architects'
	}),
	builders: many(Project, {
		relationName: 'builders'
	})
}));

export const PersonRelations = relations(Person, ({ one }) => ({
	contact: one(Contact, {
		relationName: 'ContactToPerson',
		fields: [Person.contactId],
		references: [Contact.id]
	})
}));

export const ProjectRelations = relations(Project, ({ one }) => ({
	customer: one(Contact, {
		relationName: 'customers',
		fields: [Project.customerContactId],
		references: [Contact.id]
	}),
	object: one(Object, {
		relationName: 'ObjectToProject',
		fields: [Project.objectId],
		references: [Object.id]
	}),
	constructionManagement: one(Contact, {
		relationName: 'constructionManagements',
		fields: [Project.constructionManagementContactId],
		references: [Contact.id]
	}),
	architect: one(Contact, {
		relationName: 'architects',
		fields: [Project.architectContactId],
		references: [Contact.id]
	}),
	builder: one(Contact, {
		relationName: 'builders',
		fields: [Project.builderContactId],
		references: [Contact.id]
	})
}));

export const ObjectRelations = relations(Object, ({ many }) => ({
	projects: many(Project, {
		relationName: 'ObjectToProject'
	})
}));