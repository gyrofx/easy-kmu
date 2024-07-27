import { readFile } from 'node:fs/promises'
import { createOrUpdateContact } from '@/server/models/contact/db/createOrUpdateContact'
import { endDbConnection, initDatabase } from '@/server/db/db'
import { initOpts } from '@/server/config/opts'
import { createOrUpdateEmployee } from '@/server/models/employee/db/createOrUpdateEmployee'
import { createOrUpdateObject } from '@/server/models/projectObject/db/createOrUpdateObject'

async function main() {
  initOpts()
  await initDatabase()
  await addContactsCompany()
  await addContactsPerson()
  await addObjects()
  await addEmployees()
  await endDbConnection()
}

main().catch(console.error)

async function addContactsCompany() {
  const fakeData = await readFile('./src/scripts/testdata/contacts-company.json', 'utf-8')
  const contacts = JSON.parse(fakeData)
  for (const contact of contacts) {
    console.log(contact)
    const { id, ...rest } = contact
    await createOrUpdateContact(rest)
  }
}

async function addContactsPerson() {
  const fakeData = await readFile('./src/scripts/testdata/contacts-person.json', 'utf-8')
  const contacts = JSON.parse(fakeData)
  for (const contact of contacts) {
    console.log(contact)
    const { id, ...rest } = contact
    await createOrUpdateContact(rest)
  }
}

async function addObjects() {
  const fakeData = await readFile('./src/scripts/testdata/objects.json', 'utf-8')
  const objects = JSON.parse(fakeData)
  for (const obj of objects) {
    console.log(obj)
    const { id, buildingType, ...rest } = obj
    await createOrUpdateObject({ ...rest, appartement: buildingType })
  }
}

async function addEmployees() {
  const fakeData = await readFile('./src/scripts/testdata/employees.json', 'utf-8')
  const employees = JSON.parse(fakeData)
  for (const employee of employees) {
    console.log(employee)
    await createOrUpdateEmployee(employee)
  }
}
