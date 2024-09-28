import { asEN1090Option, asFireProtectionOption, type Project } from '@/common/models/project'
import { IsoDateString } from '@easy-kmu/common'
import { nullsToUndefined } from '@/server/models/contact/db/nullsToUndefined'
import { dbContactToConact } from '@/server/models/contact/db/listContacts'
import { dbEmployeeToEmployee } from '@/server/models/employee/db/listEmployees'
import { dbObjectToObject } from '@/server/models/projectObject/db/listProjectObjects'
import type { SelectProject } from '@/server/db/schema/projects'

export function dbProjectToProject(dbProject: SelectProject): Project {
  return nullsToUndefined({
    ...dbProject,
    projectNumber: dbProject.projectNumber.toString(),
    object: dbProject.object ? dbObjectToObject(dbProject.object) : undefined,
    customer: dbProject.customer ? dbContactToConact(dbProject.customer) : undefined,
    customerPersonsInCharge: [],
    constructionManagement: dbProject.constructionManagement
      ? dbContactToConact(dbProject.constructionManagement)
      : undefined,
    architect: dbProject.architect ? dbContactToConact(dbProject.architect) : undefined,
    architectPersonsInCharge: [],
    builder: dbProject.builder ? dbContactToConact(dbProject.builder) : undefined,
    builderPersonsInCharge: [],
    clerk: dbEmployeeToEmployee(dbProject.clerk),
    projectManager: dbEmployeeToEmployee(dbProject.projectManager),

    fireProtectionOption: asFireProtectionOption(dbProject.fireProtectionOption),
    en1090Option: asEN1090Option(dbProject.en1090Option),

    createdAt: IsoDateString(dbProject.createdAt),
    updatedAt: IsoDateString(dbProject.updatedAt),
  })
}
