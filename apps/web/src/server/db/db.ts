import { drizzle, type NodePgClient, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
import { opts } from '@/server/config/opts'
import * as schema from '@/server/db/schema'

const { Client } = pkg

export async function initDatabase() {
  clientInternal = new Client({
    connectionString: opts().databaseUrl,
  })

  await clientInternal.connect()
  dbInternal = drizzle<typeof schema>(clientInternal, { schema })
}

export function db() {
  if (!dbInternal) throw new Error('Initialize the database via initDatabase()')
  return dbInternal
}

export function endDbConnection() {
  clientInternal?.end()
}

let dbInternal: NodePgDatabase<typeof schema> | undefined
let clientInternal: NodePgClient | undefined = undefined
