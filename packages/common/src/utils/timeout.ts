export function withTimeout<T>(promise: Promise<T>, ms: number) {
  const timeout = timeOut<T>(ms)
  return Promise.race([promise, timeout])
}

function timeOut<T>(ms: number) {
  return new Promise<T>((_resolve, reject) =>
    setTimeout(() => reject(new Error(`timeout reached after ${ms}ms`)), ms),
  )
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), ms))
}
