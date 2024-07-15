import { unknownAsError } from '@/common/utils/errors'
import { logger } from '@/server/logging/logger'
import IORedis, { Pipeline, Redis, RedisOptions } from 'ioredis'

let rootRedis: Redis | undefined

export async function serverResetRedisOnlyForTests() {
  await serverRedis().quit()
  rootRedis = undefined
}

export function serverRedis(): Redis {
  if (!rootRedis) throw new Error('Redis not initialized')
  return rootRedis
}

export function serverInitRedis(url: string | undefined = undefined) {
  if (rootRedis) throw new Error('Redis already initialized')
  rootRedis = url ? new IORedis(url) : new IORedis()
  setErrorHandler(rootRedis)
}

export function serverExclusiveInstance(options?: RedisOptions): Redis {
  if (!rootRedis) throw new Error('Redis not initialized')
  const instance = rootRedis.duplicate(options)
  setErrorHandler(instance)
  return instance
}

type AwaitedExecReturn = Awaited<ReturnType<Pipeline['exec']>> | null
/**
 * Check the results of `exec()` and throw on any errors.
 * @param results the awaited return value of an `exec()` call.
 */
export function throwOnExecErrors(results: AwaitedExecReturn) {
  if (results === null) {
    throw new Error('Transaction failed: EXEC returned null')
  }
  const firstError = results.find(([err, _result]) => err !== null)
  if (firstError) {
    const err = firstError[0]
    throw err || new Error('Transaction failed: EXEC returned null')
  }
}

function setErrorHandler(redisInstance: Redis) {
  redisInstance.addListener('error', (error: unknown) => {
    logger().error('Redis connection error', unknownAsError(error))
  })
}
