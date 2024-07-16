export function assertNonNullish<T>(value: T, message: string): asserts value is NonNullable<T> {
  if (!nonNullish(value)) throw new Error(message)
}

export function nonNullish<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

type NonNullable<T> = T extends null | undefined ? never : T
