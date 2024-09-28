import { relations, sql } from 'drizzle-orm'
import { pgTable, text, real, integer, timestamp } from 'drizzle-orm/pg-core'

export const materials = pgTable('materials', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),

  name: text('type').notNull(),
  materialGroupId: text('materialGroupId')
    .notNull()
    .references(() => materialGroups.id),
  kgPerMeter: real('kgPerMeter'),
  centsPerMeter: integer('centsPerMeter'),
  centsPerKg: integer('centsPerKg'),
  meterPerUnit: integer('meterPerUnit'),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export const materialGroups = pgTable('materialGroups', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  image: text('image').notNull().default(''),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectMaterialGroup = typeof materialGroups.$inferSelect
export type SelectMaterial = typeof materials.$inferSelect

export const materialRelations = relations(materials, ({ one }) => ({
  materialGroup: one(materialGroups, {
    relationName: 'materialGroupToMaterial',
    fields: [materials.materialGroupId],
    references: [materialGroups.id],
  }),
}))

export const materialGroupRelations = relations(materialGroups, ({ many }) => ({
  materials: many(materials, {
    relationName: 'materialGroupToMaterial',
  }),
}))
