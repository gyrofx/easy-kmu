import { cloneDeep } from 'lodash'
import { unknownErrorToPlainObject } from './errors'

/**
 * Helps to test functions that throw errors, and shows what would be logged by the logger in
 * production (without the stack trace). Catches, serializes and returns the error.
 *
 * Only use this function in tests
 */
export function catchErrorForTest(fn: (...args: any[]) => Exclude<any, Promise<any>>) {
  try {
    fn()
    throw new Error('Expected an error to be thrown')
  } catch (e) {
    return removeStackAndStringifiedFieldsRecursively(unknownErrorToPlainObject(e))
  }
}

/**
 * Helps to test functions that throw errors, and shows what would be logged by the logger in
 * production (without the stack trace). Catches, serializes and returns the error.
 *
 * Only use this function in tests
 */
export async function catchErrorForTestAsync(fn: (...args: any[]) => Promise<any>) {
  try {
    await fn()
    throw new Error('Expected an error to be thrown')
  } catch (e) {
    return removeStackAndStringifiedFieldsRecursively(unknownErrorToPlainObject(e))
  }
}

function removeStackAndStringifiedFieldsRecursively(object: Record<any, any>) {
  return removeStackAndStringifiedFieldsRecursivelyInner(cloneDeep(object))
}

function removeStackAndStringifiedFieldsRecursivelyInner(object: Record<any, any>) {
  if (object.stack) object.stack = undefined
  if (object.stringified) object.stringified = undefined
  Object.values(object).forEach((value) => {
    if (typeof value === 'object') {
      removeStackAndStringifiedFieldsRecursivelyInner(value)
    }
  })

  return object
}

/**
 * Only use this function in tests
 */
export function expectErrorToContainInvalidObject(invalidObject: unknown) {
  return expect.objectContaining({ details: expect.objectContaining({ invalidObject }) })
}
