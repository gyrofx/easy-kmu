import { create } from 'zustand'
import { produce } from 'immer'
import type { CreateOrUpdateTask } from '@/common/models/task'
import { emptyTask } from './emptyTask'

interface TaskState {
  task: CreateOrUpdateTask
  setInitialTask: (task: CreateOrUpdateTask) => void
  setName: (value: string) => void
  setDescription: (value: string) => void
  setNotes: (value: string) => void

  clear: () => void
}

export const useTaskStore = create<TaskState>((set) => ({
  task: emptyTask(),
  setInitialTask: (task: CreateOrUpdateTask) => set((state) => ({ ...state, task })),
  setName: (value: string) =>
    set((state) =>
      produce(state, (draft) => {
        draft.task.name = value
      }),
    ),
  setDescription: (value: string) =>
    set((state) =>
      produce(state, (draft) => {
        draft.task.description = value
      }),
    ),
  setNotes: (value: string) =>
    set((state) =>
      produce(state, (draft) => {
        draft.task.notes = value
      }),
    ),

  clear: () => set((state) => ({ ...state, task: emptyTask() })),
}))
