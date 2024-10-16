import type { WorkingTimeEntry } from '@/common/models/workingTime'
import { db } from '@/server/db/db'
import { workingTimeEntry } from '@/server/db/schema'
import { toTs } from '@/server/models/workTimes/db/toTs'
import type { IsoDateString } from '@easy-kmu/common'
import { and, eq, gte, lte } from 'drizzle-orm'

export async function findWorkTimesFromDb(
  query: { from: IsoDateString; to: IsoDateString },
  userId: string,
): Promise<WorkingTimeEntry[]> {
  const list = await db().query.workingTimeEntry.findMany({
    where: and(
      eq(workingTimeEntry.userId, userId),
      and(gte(workingTimeEntry.day, query.from), lte(workingTimeEntry.day, query.to)),
    ),
  })
  return list.map(toTs)
}
