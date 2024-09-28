import { materials } from '@/server/db/schema/materials'
import { projects } from '@/server/db/schema/projects'
import { relations, sql } from 'drizzle-orm'
import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const materialLists = pgTable('materialLists', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  taskId: text('taskId')
    .notNull()
    .references(() => projects.id),
  name: text('name').notNull(),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export const materialListItems = pgTable('materialListItems', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  materialListId: text('materialListId')
    .notNull()
    .references(() => materialLists.id),
  materialId: text('materialId')
    .notNull()
    .references(() => materials.id),
  quantity: integer('quantity').notNull(),
  available: boolean('available').notNull().default(false),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export const materialListItemsRelations = relations(materialListItems, ({ one }) => ({
  material: one(materials, {
    relationName: 'materialToMaterialListItem',
    fields: [materialListItems.materialId],
    references: [materials.id],
  }),

  materialList: one(materialLists, {
    relationName: 'materialListToMaterialListItem',
    fields: [materialListItems.materialId],
    references: [materialLists.id],
  }),
}))
