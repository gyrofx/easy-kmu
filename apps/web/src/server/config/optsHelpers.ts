import fs from 'node:fs'
import { URL } from 'node:url'

import { trim } from 'lodash'
import { parseInt10 } from '@easy-kmu/common/src/utils/number'
import { type NonemptyArray, isNonempty } from '@easy-kmu/common/src/utils/array'
import { ErrorWithDetails } from '@easy-kmu/common/src/utils/errors'
import { splitTrimTruthy } from '@easy-kmu/common/src/utils/string'

export function optionalEnvBoolean(field: string, defaultValue: boolean, env: Environment): boolean {
  const raw = env[field]

  if (raw === 'true') return true

  if (raw === 'false') return false

  if (!raw) return defaultValue

  throw new Error(
    `${errorHint(
      field,
    )}. Expected "true", "false", or a value that is treated as false (=> defaultValue), but was "${raw}"`,
  )
}

export function requiredEnvNumber(field: string, env: Environment) {
  const raw = requiredEnvString(field, env)
  try {
    const value = parseInt10(raw)
    if (value.toString() === raw) {
      return value
    }
  } catch {
    // pass
  }

  throw new Error(`${errorHint(field)}. Expected a number, but was "${raw}"`)
}

export function optionalEnvNumber(field: string, defaultValue: number, env: Environment) {
  const value = env[field]
  return value ? requiredEnvNumber(field, env) : defaultValue
}

export function optionalEnvHostString(field: string, env: Environment) {
  const url = optionalEnvString(field, env)
  if (url) validateHttpUrl(url)
  return url
}

function validateHttpUrl(maybeUrl: string) {
  const url = new URL(maybeUrl)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw Error(`Expected host to start with https:// or http://, but was "${maybeUrl}"`)
  }
  if (maybeUrl.endsWith('/')) {
    throw new Error(`Expected host to not end with a trailing slash, but was "${maybeUrl}"`)
  }
}

export function requiredEnvSplitString(
  field: string,
  env: Environment,
  props: {
    split: string
    minSingleWordLength: number
  },
): NonemptyArray<string> {
  const { split, minSingleWordLength } = props
  const stringValue = requiredEnvString(field, env)
  const arrayValue = splitTrimTruthy(stringValue, split)
  if (arrayValue.some((v) => v.length < minSingleWordLength)) {
    throw new Error(
      `${errorHint(
        field,
      )}. Expected each part to be at least ${minSingleWordLength} characters long, but was "${stringValue}"`,
    )
  }
  if (isNonempty(arrayValue)) return arrayValue

  throw new Error(`Expected at least one value after split, but was "${stringValue}"`)
}

export function requiredEnvString(field: string, env: Environment) {
  return requiredString(field, env[field])
}

export function optionalEnvString(field: string, env: Environment) {
  const value = env[field]
  // treat whitespace-only values as undefined
  if (value && value.trim().length === 0) return undefined
  return value
}

function requiredString(field: string, value: string | undefined) {
  if (value && value.trim().length > 0) return value
  // treat whitespace-only values as undefined
  throw new Error(errorHint(field))
}

function errorHint(field: string) {
  return `Invalid config value for env variable ${field}. See .env.example to setup .env, or set the env variable ${field}`
}

export function fileExists(path: string) {
  if (fs.existsSync(path)) {
    return path
  }
  throw new ErrorWithDetails(`File at configured path doesn't exist`, {
    details: { path },
  })
}

export type Environment = Record<string, string | undefined>

export function parseTrustedProxySubnets(envVarName: string, env: Environment): string[] | undefined {
  const raw = optionalEnvString(envVarName, env)
  const trimmed = raw?.split(',').map(trim)
  const re = /^\d+\.\d+\.\d+\.\d+(\/\d+)?$/
  trimmed?.forEach((s) => {
    if (!s.match(re))
      throw new ErrorWithDetails('Invalid trusted proxy subnet', { details: { value: s } })
  })
  return trimmed
}
