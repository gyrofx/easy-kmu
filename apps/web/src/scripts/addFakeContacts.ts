import { readFile } from 'node:fs/promises'
import { initPrisma } from '@/server/db/prisma'
import { createOrUpdateContact } from '@/server/contact/contactDb'

async function main() {
  initPrisma()
  const fakeData = await readFile('./src/scripts/contacts_fake_data.json', 'utf-8')
  const contacts = JSON.parse(fakeData)
  for (const contact of contacts) {
    console.log(contact)
    const { id, ...rest } = contact
    await createOrUpdateContact(rest)
  }
}

main().catch(console.error)
