import { findLastIndex, first, isArray, last } from 'lodash'

export function truthy<T>(value: T): value is Truthy<T> {
  return !!value
}

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T

export function defined<T>(value: T): value is Exclude<T, undefined | null> {
  return value !== undefined && value !== null
}

export type NonemptyArray<T> = { 0: T } & T[]
export function isNonempty<T>(array: T[]): array is NonemptyArray<T> {
  return array.length > 0
}

export function isAtLeastLength<T>(array: T[], length: 1): array is [T] & T[]
export function isAtLeastLength<T>(array: T[], length: 2): array is [T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: 3): array is [T, T, T] & T[]
export function isAtLeastLength<T>(array: T[], length: number): array is NonemptyArray<T> {
  return array.length >= length
}

export function isLength<T>(array: T[], length: 0): array is []
export function isLength<T>(array: T[], length: 1): array is [T]
export function isLength<T>(array: T[], length: 2): array is [T, T]
export function isLength<T>(array: T[], length: 3): array is [T, T, T]
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

export function makeArray<T>(value: T | T[]): T[] {
  if (isArray(value)) return value
  return [value]
}
