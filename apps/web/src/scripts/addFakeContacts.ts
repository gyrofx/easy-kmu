import { readFile } from 'node:fs/promises'
import { createOrUpdateContact } from '@/server/models/contact/db/createOrUpdateContact'
import { endDbConnection, initDatabase } from '@/server/db/db'
import { initOpts } from '@/server/config/opts'

async function main() {
  initOpts()
  await initDatabase()
  const fakeData = await readFile('./src/scripts/contacts_fake_data.json', 'utf-8')
  const contacts = JSON.parse(fakeData)
  for (const contact of contacts) {
    console.log(contact)
    const { id, ...rest } = contact
    await createOrUpdateContact(rest)
  }
  await endDbConnection()
}

main().catch(console.error)
