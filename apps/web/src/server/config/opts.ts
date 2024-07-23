import type { Auth0Opts } from '@/common/config/Auth0Opts'
import {
  type Environment,
  fileExists,
  optionalEnvBoolean,
  optionalEnvNumber,
  requiredEnvString,
} from '@/server/config/optsHelpers'
import { config } from 'dotenv'
import { resolve } from 'node:path'

config()

let internalOpts: Opts | undefined

export function opts() {
  if (!internalOpts) throw new Error('Initialize the options via initOpts()')
  return internalOpts
}

export function initOpts() {
  internalOpts = initOptsInternal(process.env)
}

export function initOptsInternal(env: NodeJS.ProcessEnv) {
  const options = {
    host: env.HOST || '',
    port: optionalEnvNumber('EKMU_WEB_PORT', 8080, env),
    https: httpsOpts(env),
    isProduction: isProduction(env),
    isDevelopment: isDevelopment(env),
    isTest: isTest(env),
    auth: parseAuthOpts(env),
    session: sessionOpts(env),
    redisUrl: requiredEnvString('EKMU_WEB_REDIS_URL', env),
    databaseUrl: requiredEnvString('EKMU_WEB_DATABASE_URL', env),
    pdfService: parsePdfService(env),
    fileStorage: parseFileStorage(env),
  }
  ensureSafeOptsAndEnvironment(options, env)
  return options
}

export function urlIsAllowedForRedirect(url: string, allowedHosts: string[]): boolean {
  const urlHost = new URL(url).hostname
  return allowedHosts.some((host) => urlHost === host)
}

function httpsOpts(env: Environment): HTTPSOpts {
  return optionalEnvBoolean('HTTPS', false, env)
    ? {
        enabled: true,
        sslKeyFile: fileExists(requiredEnvString('SSL_KEY_FILE', env)),
        sslCertFile: fileExists(requiredEnvString('SSL_CRT_FILE', env)),
      }
    : { enabled: false }
}

function isProduction(env: Environment): boolean {
  return env.NODE_ENV === 'production'
}

function isDevelopment(env: Environment): boolean {
  return env.NODE_ENV === 'development'
}

function isTest(env: Environment): boolean {
  return env.NODE_ENV === 'test'
}

function sessionOpts(env: Environment): SessionOpts {
  return {
    secret: requiredEnvString('EKMU_WEB_SESSION_SECRET', env),
  }
}

export interface Opts {
  readonly host: string
  readonly port: number
  readonly https: HTTPSOpts
  readonly isProduction: boolean
  readonly isDevelopment: boolean
  readonly isTest: boolean
  readonly session: SessionOpts
  readonly auth: AuthOpts
  readonly redisUrl: string
  readonly databaseUrl: string
  readonly pdfService: PdfServiceOpts
  readonly fileStorage: FileStorageOpts
}

export type HTTPSOpts = HTTPSOptsSet | HTTPSOptsUnset

export interface HTTPSOptsUnset {
  readonly enabled: false
}
export interface HTTPSOptsSet {
  readonly enabled: true
  readonly sslKeyFile: string
  readonly sslCertFile: string
}

export interface SessionOpts {
  readonly secret: string
}

export interface AuthOpts {
  readonly auth0: Auth0Opts
}

function parseAuthOpts(env: Environment): AuthOpts {
  return {
    auth0: {
      secret: requiredEnvString('EKMU_WEB_AUTH_SECRET', env),
      domain: requiredEnvString('EKMU_WEB_AUTH0_DOMAIN', env),
      clientId: requiredEnvString('EKMU_WEB_AUTH0_CLIENT_ID', env),
      clientSecret: requiredEnvString('EKMU_WEB_AUTH0_CLIENT_SECRET', env),
      scope: 'openid profile email',
      audience: 'https://worklog.aq1.ch',
      redirectUrl: requiredEnvString('EKMU_WEB_AUTH0_REDIRECT_URL', env),
    },
  }
}

function ensureSafeOptsAndEnvironment(options: { isProduction: boolean }, env: Environment) {
  if (options.isProduction) {
    if (env.NODE_TLS_REJECT_UNAUTHORIZED !== undefined) {
      throw new Error('NODE_TLS_REJECT_UNAUTHORIZED is not allowed in production environment')
    }
  }
}

function parsePdfService(env: Environment): PdfServiceOpts {
  return {
    url: requiredEnvString('EKMU_PDF_SERVICE_URL', env),
  }
}

export interface PdfServiceOpts {
  url: string
}

function parseFileStorage(env: NodeJS.ProcessEnv): FileStorageOpts {
  return {
    path: resolve(requiredEnvString('EKMU_FILE_STORAGE_PATH', env)),
  }
}

interface FileStorageOpts {
  path: string
}
