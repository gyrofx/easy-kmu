import type { CreateOrUpdateProject, Project } from '@/common/models/project'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProjectState {
  project: CreateOrUpdateProject
  setInitialProject: (project: CreateOrUpdateProject) => void
  setValue: (key: ProjectKeys, value: string | undefined) => void
  clear: () => void
}

type ProjectKeys = keyof Project

export const useProjectStore = create(
  persist<ProjectState>(
    (set) => ({
      project: emptyProject(),
      setInitialProject: (project: CreateOrUpdateProject) => set((state) => ({ ...state, project })),

      setValue: (key: ProjectKeys, value: string | undefined) =>
        set((state) => ({ ...state, project: { ...state.project, [key]: value } })),

      clear: () => set((state) => ({ ...state, contact: emptyProject() })),
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
    objectId: undefined,
    constructionManagementContactId: undefined,
    architectContactId: undefined,
    builderContactId: undefined,
    clerkEmployeeId: '',

    material: '',
    assembly: '',
    surface: '',
    fireProtection: '',
    en1090: '',
    deadline: undefined,
  }
}
