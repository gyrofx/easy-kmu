import type { SpecialDay } from '@/common/models/workingTime'
import { db } from '@/server/db/db'
import { specialDays } from '@/server/db/schema'
import type { SelectSpecialDay } from '@/server/db/schema/workingTimes'
import { IsoDateString } from '@easy-kmu/common'
import { and, gte, lte } from 'drizzle-orm'

export async function findSpecialDaysFromDb(query: { from: IsoDateString; to: IsoDateString }): Promise<
  SpecialDay[]
> {
  const list = await db().query.specialDays.findMany({
    where: and(gte(specialDays.day, query.from), lte(specialDays.day, query.to)),
  })
  return list.map(dbSpecialDayToSpecialDay)
}

export function dbSpecialDayToSpecialDay(dbSpecialDay: SelectSpecialDay): SpecialDay {
  return {
    ...dbSpecialDay,
    day: IsoDateString(dbSpecialDay.day),
    createdAt: IsoDateString(dbSpecialDay.createdAt),
    updatedAt: IsoDateString(dbSpecialDay.updatedAt),
  }
}
