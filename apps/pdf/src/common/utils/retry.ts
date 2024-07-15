import { sleep } from './timeout'

export function retryNtimesWithSleep<T>(
  retries: number,
  fn: () => Promise<T>,
  waitMillis: number
): Promise<T> {
  return retryNtimes(retries, async () => {
    try {
      return await fn()
    } catch (e: unknown) {
      await sleep(waitMillis)
      throw e
    }
  })
}

export async function retryNtimes<T>(retries: number, fn: () => Promise<T>): Promise<T> {
  const errors = []
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (err: unknown) {
      errors.push(err)
    }
  }
  throw errors.pop()
}
