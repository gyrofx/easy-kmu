import { deleteWorkTimeFromDb } from '@/server/models/workTimes/db/deleteWorkTimeFromDb'
import { findWorkTimeById } from '@/server/models/workTimes/findWorkTimeById'
import type { AdapterUser } from '@auth/express/adapters'

export async function deleteMyWorkTime(workTimeId: string, user: AdapterUser) {
  const workTime = findWorkTimeById(workTimeId)
  if (!workTime) throw new Error('Work time not found')
  if (workTime.userId !== user.id) throw new Error('Access denied')
  await deleteWorkTimeFromDb(workTimeId)
}
