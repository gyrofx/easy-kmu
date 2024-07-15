import {
  type Environment,
  fileExists,
  optionalEnvBoolean,
  optionalEnvNumber,
  requiredEnvString,
} from '@/server/config/optsHelpers'
import { config } from 'dotenv'

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
    port: optionalEnvNumber('EKMU_PDF_PORT', 8081, env),
    https: httpsOpts(env),
    isProduction: isProduction(env),
    isDevelopment: isDevelopment(env),
    isTest: isTest(env),
    // session: sessionOpts(env),
    redisUrl: requiredEnvString('EKMU_PDF_REDIS_URL', env),
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

export interface Opts {
  readonly host: string
  readonly port: number
  readonly https: HTTPSOpts
  readonly isProduction: boolean
  readonly isDevelopment: boolean
  readonly isTest: boolean
  // readonly session: SessionOpts
  readonly redisUrl: string
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

function ensureSafeOptsAndEnvironment(options: { isProduction: boolean }, env: Environment) {
  if (options.isProduction) {
    if (env.NODE_TLS_REJECT_UNAUTHORIZED !== undefined) {
      throw new Error('NODE_TLS_REJECT_UNAUTHORIZED is not allowed in production environment')
    }
  }
}
