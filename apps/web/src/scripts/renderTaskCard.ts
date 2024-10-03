import { asEN1090Option, asFireProtectionOption, type Project } from '@/common/models/project'
import type { Task } from '@/common/models/task'
import { taskToHtml } from '@/server/models/task/taskToHtml'
import { IsoDateString } from '@easy-kmu/common'
import { mkdir, writeFile } from 'node:fs/promises'

export async function main() {
  const project: Project = {
    id: '1',
    projectNumber: '1234',
    name: '',
    description: '',
    notes: '',
    object: {
      id: '1',
      address: 'Knoblauchweg 23',
      zipCode: '8800',
      city: 'Fällanden',
      country: '',
      floor: '',
      appartement: 'MHF',
      workshopOrder: '',
      notes: '',
      createdAt: '',
      updatedAt: '',
    },
    customer: undefined,
    architect: undefined,
    projectManager: {
      id: '1',
      firstName: 'Roger',
      lastName: 'Stoop',
      email: 'roger.stoop@stoopmetallbau.ch',
      phone1: '',
      phone2: '',
      notes: '',
      createdAt: IsoDateString(new Date()),
      updatedAt: IsoDateString(new Date()),
    },
    clerk: {
      id: '1',
      firstName: 'Roger',
      lastName: 'Stoop',
      email: 'roger.stoop@stoopmetallbau.ch',
      phone1: '',
      phone2: '',
      notes: '',
      createdAt: IsoDateString(new Date()),
      updatedAt: IsoDateString(new Date()),
    },

    clerkEmployeeId: '1',
    projectManagerEmployeeId: '1',

    customerReference: 'MyRef',

    material: '',
    assembly: 'inklusive',
    surface: '',
    surfaceColor: '',
    fireProtection: false,
    fireProtectionOption: asFireProtectionOption('level1'),
    en1090: false,
    en1090Option: asEN1090Option('ex1'),

    createdAt: IsoDateString(new Date()),
    updatedAt: IsoDateString(new Date()),
  }

  const task: Task = {
    id: '1',
    projectId: '1',
    name: 'Ausführung',
    description: '',
    notes: '',
    createdAt: IsoDateString(new Date()),
    updatedAt: IsoDateString(new Date()),
  }

  const { files } = await taskToHtml(project, task)
  console.log(files)

  await mkdir('./tmp', { recursive: true })
  for (const { path, content } of files) {
    await writeFile(`./tmp/${path}`, content)
  }
}

main().catch(console.error)
