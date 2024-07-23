import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.EKMU_WEB_DATABASE_URL || 'postgres://ekmu:ekmu@localhost:5432/ekmu',
  },
  verbose: true,
  strict: true,
})
