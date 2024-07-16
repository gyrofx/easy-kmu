import { readdirSync } from 'node:fs'
import path from 'node:path'
import { config as dotenvConfig } from 'dotenv'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

dotenvConfig()

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [viteTsconfigPaths()],
  test: {
    globals: true,
    mockReset: true,
    include: ['**/__tests__/**/*{test,spec}.?(c|m)[jt]s?(x)', '**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
    // setupFiles: ['src/setupTests.ts'],
    // coverage: {
    //   reporter: process.env.CI ? ['text', 'text-summary', 'html', 'lcov', 'cobertura'] : undefined,
    //   provider: 'v8',
    // },
    // reporters: process.env.CI ? ['default', 'html', 'junit'] : undefined,

    outputFile: {
      junit: 'test-report/junit.xml',
      html: 'test-report/test-report.html',
    },
    exclude: [...configDefaults.exclude, ...excludedTestPatterns()],
  },
  resolve: { alias: alias() },
})

function excludedTestPatterns() {
  return []
}

function alias() {
  const directories = readdirSync(path.resolve(__dirname, './src'), {
    withFileTypes: true,
  })
  return Object.fromEntries(
    directories.map((dir) => [dir.name, path.resolve(__dirname, `./src/${dir.name}`)]),
  )
}
