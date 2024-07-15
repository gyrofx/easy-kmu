import { execSync } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

async function main() {
  const gitRef = execSync('git rev-parse --short HEAD')
  const gitBranch = execSync('git rev-parse --abbrev-ref HEAD')
  const buildTime = new Date().toISOString()

  await writeFile(
    'src/buildInfo.ts',
    `export const gitRef = '${gitRef.toString().trim()}'
export const gitBranch = '${gitBranch.toString().trim()}'
export const buildTime = '${buildTime}'`,
  )
}

main().catch(console.error)
