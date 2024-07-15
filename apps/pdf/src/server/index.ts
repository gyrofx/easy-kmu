/* eslint-disable no-console */
import { initOpts } from '@/server/config/opts'
import { startServer } from '@/server/serverStartup/startServer'

async function main() {
  initOpts()
  // make sure the env variables and options are loaded before importing any
  // other module, which may use the options
  await startServer()
}

function handleErrorDelicately(error: unknown) {
  if (error instanceof Error) {
    try {
      console.error(
        JSON.stringify({
          name: error.name,
          message: error.message,
          stack: error.stack,
          unhandledRejection: true,
        }),
      )
    } catch {
      console.error(error)
    }
  } else {
    console.error('The following error was caught by the root error handler')
    console.error("Printing normally instead of as object because we're in dev mode")
    console.error(error)
  }
  process.exit(1)
}

process.on('unhandledRejection', handleErrorDelicately)
main().catch(handleErrorDelicately)
