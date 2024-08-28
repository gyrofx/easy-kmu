import {
  asEN1090Option,
  asFireProtectionOption,
  type CreateOrUpdateProject,
} from '@/common/models/project'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export interface ProjectState {
  project: CreateOrUpdateProject
  setInitialProject: (project: CreateOrUpdateProject) => void
  setValue: <T>(key: ProjectKeys, value: T) => void
  clear: () => void
}

export type ProjectKeys = keyof CreateOrUpdateProject

export const useProjectStore = create(
  persist<ProjectState>(
    (set) => ({
      project: emptyProject(),
      setInitialProject: (project: CreateOrUpdateProject) => set((state) => ({ ...state, project })),

      setValue: <T>(key: ProjectKeys, value: T) =>
        set((state) => ({ ...state, project: { ...state.project, [key]: value } })),

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

    objectId: undefined,

    customerContactId: undefined,
    constructionManagementContactId: undefined,
    architectContactId: undefined,
    builderContactId: undefined,
    clerkEmployeeId: '',
    projectManagerEmployeeId: '',

    customerReference: '',

    material: '',
    assembly: '',
    surface: '',
    surfaceColor: '',
    fireProtection: false,
    fireProtectionOption: asFireProtectionOption('level1'),
    en1090: false,
    en1090Option: asEN1090Option('ex1'),
  }
}
