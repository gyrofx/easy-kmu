import type { CreateOrUpdateProject } from '@/common/models/project'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { produce } from 'immer'
export interface ProjectState {
  project: CreateOrUpdateProject
  setInitialProject: (project: CreateOrUpdateProject) => void
  setValue: <T>(key: ProjectKeys, value: T) => void
  addArrayValue: (key: ProjectArrayValueKeys, value: string) => void
  setArrayValue: (key: ProjectArrayValueKeys, index: number, value: string) => void
  removeArrayValue: (key: ProjectArrayValueKeys, index: number) => void
  clear: () => void
}

export type ProjectKeys = keyof Omit<
  CreateOrUpdateProject,
  | 'customerPersonsInCharge'
  | 'constructionManagementPersonsInCharge'
  | 'architectPersonsInCharge'
  | 'builderPersonsInCharge'
>

export type ProjectArrayValueKeys =
  | 'customerPersonsInCharge'
  | 'constructionManagementPersonsInCharge'
  | 'architectPersonsInCharge'
  | 'builderPersonsInCharge'

export const useProjectStore = create(
  persist<ProjectState>(
    (set) => ({
      project: emptyProject(),
      setInitialProject: (project: CreateOrUpdateProject) => set((state) => ({ ...state, project })),

      setValue: <T>(key: ProjectKeys, value: T) =>
        set((state) => ({ ...state, project: { ...state.project, [key]: value } })),

      addArrayValue: (key: ProjectArrayValueKeys, value: string) =>
        set((state) =>
          produce(state, (draft) => {
            if (!draft.project[key]) draft.project[key] = [value]
            else draft.project[key].push(value)
          }),
        ),

      setArrayValue: (key: ProjectArrayValueKeys, index: number, value: string) =>
        set((state) =>
          produce(state, (draft) => {
            if (index < draft.project[key].length) draft.project[key][index] = value
          }),
        ),

      removeArrayValue: (key: ProjectArrayValueKeys, index: number) =>
        set((state) => produce(state, (draft) => void draft.project[key].splice(index, 1))),

      clear: () => set((state) => ({ ...state, project: emptyProject() })),
    }),
    {
      name: 'new-project-store',
      // storage: createJSONStorage(() => localStorage),
    },
  ),
)

function emptyProject(): CreateOrUpdateProject {
  return {
    id: undefined,
    name: '',
    description: '',
    notes: '',

    customerContactId: undefined,
    customerPersonsInCharge: [],

    objectId: undefined,
    constructionManagementContactId: undefined,
    constructionManagementPersonsInCharge: [],
    architectContactId: undefined,
    architectPersonsInCharge: [],
    builderContactId: undefined,
    builderPersonsInCharge: [],
    clerkEmployeeId: '',

    material: '',
    assembly: '',
    surface: '',
    fireProtection: '',
    en1090: '',
    deadline: undefined,
  }
}
