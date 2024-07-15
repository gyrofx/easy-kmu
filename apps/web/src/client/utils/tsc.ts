export function defined<T>(data: T | null | undefined): data is T {
  return typeof data !== 'undefined' && data !== null
}

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T // from lodash

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

export type FilterKeys<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T]
