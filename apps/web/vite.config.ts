import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import vitePluginReact from '@vitejs/plugin-react'
import { config as dotenvConfig } from 'dotenv'
import type { ProxyOptions } from 'vite'
import vitPluginSvgr from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

dotenvConfig()

const https = httpsOpts(process.env)

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [vitePluginReact(), viteTsconfigPaths(), vitPluginSvgr()],
  build: {
    outDir: 'build',

    rollupOptions: {
      /**
       * Ignore "use client" waning since we are not using SSR
       * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
       */
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`)) {
          return
        }
        warn(warning)
      },
    },
  },
  server: {
    open: true,
    port: 3000,
    host: 'ekmu.localhost',
    https: https.enabled
      ? { key: readFileSync(https.keyFile), cert: readFileSync(https.certFile) }
      : undefined,
    proxy: apiProxy(),
  },
  preview: { proxy: apiProxy() },
  test: {
    globals: true,
    mockReset: true,
    include: ['**/__tests__/**/*{test,spec}.?(c|m)[jt]s?(x)', '**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['src/setupTests.ts'],
    // coverage: {
    // 	reporter: process.env.CI
    // 		? ["text", "text-summary", "html", "lcov", "cobertura"]
    // 		: undefined,
    // 	provider: "v8",
    // },
    // reporters: process.env.CI ? ["default", "html", "junit"] : undefined,

    outputFile: {
      junit: 'test-report/junit.xml',
      html: 'test-report/test-report.html',
    },
    exclude: [...configDefaults.exclude, ...excludedTestPatterns()],
  },
  resolve: { alias: alias() },
})

function apiProxy(): Record<string, ProxyOptions> {
  return {
    '/api': {
      target: 'https://ekmu.localhost:8080',
      secure: false,
      changeOrigin: true,
    },
    '/files': {
      target: 'https://ekmu.localhost:8080',
      secure: false,
      changeOrigin: true,
    },
    '/file': {
      target: 'https://ekmu.localhost:8080',
      secure: false,
      changeOrigin: true,
    },
    '/auth': {
      target: 'https://ekmu.localhost:8080',
      secure: false,
      changeOrigin: false,
    },
  }
}

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

function httpsOpts(env: Record<string, string | undefined>): HTTPSOpts {
  if (!env.HTTPS || env.HTTPS === 'false') return { enabled: false }
  if (!env.SSL_KEY_FILE) throw new Error('SSL_KEY_FILE not defined')
  if (!env.SSL_CRT_FILE) throw new Error('SSL_CRT_FILE not defined')
  return {
    enabled: true,
    keyFile: fileExists(env.SSL_KEY_FILE),
    certFile: fileExists(env.SSL_CRT_FILE),
  }
}

function fileExists(filePath: string) {
  if (!existsSync(filePath)) throw new Error(`File "${filePath}" doesn't exist`)

  return filePath
}

type HTTPSOpts = HTTPSOptsWithTLS | HTTPSOptsWithoutTLS

interface HTTPSOptsWithoutTLS {
  readonly enabled: false
}

interface HTTPSOptsWithTLS {
  readonly enabled: true
  readonly keyFile: string
  readonly certFile: string
}
