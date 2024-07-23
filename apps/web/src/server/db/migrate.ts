import { db } from '@/server/db/db'
import 'dotenv/config'
import { migrate } from 'drizzle-orm/mysql2/migrator'

// This will run migrations on the database, skipping the ones already applied
await migrate(db(), { migrationsFolder: './drizzle' })

// Don't forget to close the connection, otherwise the script will hang
await connection.end()
