export function createControllablePromise<T = any>(): ControllablePromise<T> {
  let resolve: ControllablePromise<T>['resolve'] | undefined = undefined
  let reject: ControllablePromise<T>['reject'] | undefined = undefined

  const promise = new Promise<T>((innerResolve, innerReject) => {
    resolve = innerResolve
    reject = innerReject
  })

  if (!resolve || !reject) throw new Error('ControllablePromise: resolve or reject not set')

  return { promise, resolve, reject }
}

export interface ControllablePromise<T> {
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason: Error) => void
  promise: Promise<T>
}
