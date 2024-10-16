import { tasks } from '@/server/db/schema/tasks'
import { users } from '@/server/db/schema/user'
import { relations, sql } from 'drizzle-orm'
import { date, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const specialDays = pgTable('specialDays', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  day: date('day').notNull().unique(),
  overridenWorkingTimeInMin: integer('overridenWorkingTimeInMin').notNull(),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectSpecialDay = typeof specialDays.$inferSelect

export const workingTimeTable = pgTable('workingTime', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),
  from: date('from').notNull().unique(),
  to: date('to').notNull().unique(),
  regularWorkingTimePerDayInMin: integer('regularWorkingTimePerDayInMin').notNull(),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export const workType = pgEnum('workType', [
  'task',
  'illnes',
  'weeding',
  'bereavement',
  'changeResidence',
  'doctorVisit',
  'other',
])

export const workingTimeEntry = pgTable('workingTimeEntry', {
  id: text('id').notNull().primaryKey().default(sql`gen_random_uuid()`),

  day: date('day').notNull(),
  workingTimeInMin: integer('workingTimeInMin').notNull(),
  workType: workType('workType').notNull(),
  taskId: text('taskId').references(() => tasks.id),
  comment: text('comment'),

  userId: text('userId')
    .notNull()
    .references(() => users.id),

  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow(),
})

export type SelectWorkingTimeOfUser = typeof workingTimeEntry.$inferSelect

export const workingTimeOfUsersRelations = relations(workingTimeEntry, ({ one }) => ({
  task: one(tasks, {
    relationName: 'task',
    fields: [workingTimeEntry.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    relationName: 'user',
    fields: [workingTimeEntry.userId],
    references: [users.id],
  }),
}))
