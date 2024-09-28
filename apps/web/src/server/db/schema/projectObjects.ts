import { projects } from '@/server/db/schema/projects'
import { sql, relations } from 'drizzle-orm'
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'

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

export const projectObjectRelations = relations(projectObjects, ({ many }) => ({
  projects: many(projects, {
    relationName: 'ProjectObjectToProject',
  }),
}))
