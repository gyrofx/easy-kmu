import { findLastIndex, first, isArray, last, sortBy } from 'lodash'

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export function defined<T>(value: T): value is Exclude<T, undefined | null> {
  return value !== undefined && value !== null
}

export type NonemptyArray<T> = [T, ...T[]]
export function isNonempty<T>(array: T[]): array is NonemptyArray<T> {
  return array.length > 0
}

export function isAtLeastLength<T>(array: T[], length: 1): array is [T] & T[]
export function isAtLeastLength<T>(array: T[], length: 2): array is [T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 3): array is [T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 4): array is [T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 5): array is [T, T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 6): array is [T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 7): array is [T, T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 8): array is [T, T, T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 9): array is [T, T, T, T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 10): array is [T, T, T, T, T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(
  array: T[],
  length: 11,
): array is [T, T, T, T, T, T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(
  array: T[],
  length: 12,
): array is [T, T, T, T, T, T, T, T, T, T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: number): array is NonemptyArray<T> {
  return array.length >= length
}

export function isLength<T>(array: T[], length: 0): array is []
export function isLength<T>(array: T[], length: 1): array is [T]
export function isLength<T>(array: T[], length: 2): array is [T, T]
export function isLength<T>(array: T[], length: 3): array is [T, T, T]
export function isLength<T>(array: T[], length: 4): array is [T, T, T, T]
export function isLength<T>(array: T[], length: 5): array is [T, T, T, T, T]
export function isLength<T>(array: T[], length: 6): array is [T, T, T, T, T, T]
export function isLength<T>(array: T[], length: 7): array is [T, T, T, T, T, T, T]
export function isLength<T>(array: T[], length: 8): array is [T, T, T, T, T, T, T, T]
export function isLength<T>(array: T[], length: 9): array is [T, T, T, T, T, T, T, T, T]
export function isLength<T>(array: T[], length: 10): array is [T, T, T, T, T, T, T, T, T, T]
export function isLength<T>(array: T[], length: 11): array is [T, T, T, T, T, T, T, T, T, T, T]
export function isLength<T>(array: T[], length: 12): array is [T, T, T, T, T, T, T, T, T, T, T, T]
export function isLength<T>(array: T[], length: number): boolean
export function isLength<T>(array: T[], length: number): boolean {
  return array.length === length
}

export function removeFirst<T>(array: T[], predicate: (value: T) => boolean): T | undefined {
  const index = array.findIndex(predicate)
  return index === -1 ? undefined : removeAt(array, index)
}

export function removeLast<T>(array: T[], predicate: (value: T) => boolean): T | undefined {
  const index = findLastIndex(array, predicate)
  return index === -1 ? undefined : removeAt(array, index)
}

export function removeAt<T>(array: T[], index: number): T | undefined {
  return array.splice(index, 1)[0]
}

export function withPreviousAndNext<T>(array: T[]): WithPreviousAndNext<T>[] {
  return array.map((current, index) => ({
    current,
    previous: array[index - 1],
    next: array[index + 1],
    index,
  }))
}

export function neighbors<T>(array: readonly T[]): [T, T][] {
  const result: [T, T][] = []
  for (let i = 0; i + 1 < array.length; i++) {
    result.push([array[i] as T, array[i + 1] as T])
  }
  return result
}

export function findObjectAndIndex<T>(
  array: T[],
  predicate: (value: T, index: number, obj: T[]) => unknown,
): [T | undefined, number] {
  const index = array.findIndex(predicate)
  return [array[index], index]
}

export function allOrNone<T>(objects: T[], predicate: (obj: T) => boolean, createError: () => Error) {
  if (objects.length === 0) return false

  const some = objects.some(predicate)
  const every = objects.every(predicate)

  if (!some) return false
  if (every) return true

  throw createError()
}

export function firstOrThrow<T>(path: T[]) {
  const firstElement = first(path)
  if (!firstElement) throw new Error('Empty Array')
  return firstElement
}

export function lastOrThrow<T>(path: T[]) {
  const lastElement = last(path)
  if (!lastElement) throw new Error('Empty Array')
  return lastElement
}

export interface WithPreviousAndNext<T> {
  current: T
  previous: T | undefined
  next: T | undefined
  index: number
}

export function makeArray<T>(value: T | T[]): T[] {
  if (isArray(value)) return value
  return [value]
}

export function sortByLowerCase(array: string[]): string[] {
  return sortBy(array, (value) => value.toLocaleLowerCase())
}

export function move<T>(array: T[], fromIndex: number, toIndex: number) {
  const length = array.length

  if (length === 0 || fromIndex === toIndex || fromIndex < 0 || fromIndex >= length) {
    return array
  }

  if (toIndex >= length) {
    toIndex = length - 1
  } else if (toIndex < 0) {
    toIndex = 0
  }

  const item = array[fromIndex]
  const result = array.filter((_, index) => index !== fromIndex)
  return [...result.slice(0, toIndex), item, ...result.slice(toIndex)].filter(truthy)
}
