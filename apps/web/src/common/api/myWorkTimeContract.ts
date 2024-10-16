import { contract } from '@/common/api/contract'
import { zodWorkingTimeEntry, zodCreateOrUpdateWorkingTimeEntry } from '@/common/models/workingTime'
import { ContractNoBody } from '@ts-rest/core'
import { z } from 'zod'

export const myWorkTimeContract = contract.router({
  listMyWorkTimes: {
    method: 'GET',
    path: '/api/list-my-work-times',
    responses: { 200: z.array(zodWorkingTimeEntry) },
    query: z.object({ from: z.date().optional(), to: z.date().optional() }),
  },

  createOrUpdateMyWorkTime: {
    method: 'POST',
    path: '/api/create-or-update-my-work-time',
    body: zodCreateOrUpdateWorkingTimeEntry,
    responses: { 200: zodWorkingTimeEntry },
  },

  deleteMyWorkTime: {
    method: 'DELETE',
    path: '/api/delete-my-work-time/:id',
    body: ContractNoBody,
    responses: { 200: z.object({ success: z.boolean() }) },
  },
})
