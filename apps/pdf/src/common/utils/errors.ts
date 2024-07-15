export function unknownErrorToPlainObject(error: unknown) {
  return errorToPlainObject(unknownAsError(error))
}

export function errorToPlainObject(error: Error | ErrorLike, level = 0): Record<string, any> {
  if (level > 20) return { type: 'error', name: 'Too deep', message: 'Too many levels of error.cause' }
  const cause = toErrorLike(error.cause)
  return {
    name: error.name,
    message: error.message,
    stack: error.stack || '',
    cause: !cause ? '' : errorToPlainObject(cause, level + 1),
    details: 'details' in error || error instanceof ErrorWithDetails ? error.details : undefined,
    type: 'error',
    stringified: error.toString(),
  }
}

function toErrorLike(cause: unknown): Error | ErrorLike | undefined {
  try {
    if (!cause) return undefined
    if (cause instanceof Error) return cause
    if (typeof cause !== 'object') return undefined

    const error: ErrorLike = {
      name: 'name' in cause && typeof cause.name === 'string' ? cause.name : '',
      message: 'message' in cause && typeof cause.message === 'string' ? cause.message : '',
      stack: 'stack' in cause && typeof cause.stack === 'string' ? cause.stack : '',
      cause: 'cause' in cause ? cause.cause : undefined,
      details: 'details' in cause ? cause.details : undefined,
      toString: () =>
        'stringified' in cause && typeof cause.stringified === 'string' && cause.stringified
          ? cause.stringified
          : cause.toString(),
    }
    return error.name && error.message ? error : undefined
  } catch {
    return undefined
  }
}

export interface ErrorLike {
  name: string
  message: string
  stack?: string
  cause: unknown
  details?: unknown
  toString: () => string
}

export function friendlyError(error: unknown) {
  if (typeof error === 'string') {
    return error
  }
  if (typeof error === 'object' && error) {
    const errorObject: { message?: unknown } = error
    if (typeof errorObject.message === 'string') {
      return errorObject.message
    }
    return JSON.stringify(error)
  }
  return 'Unknown Error'
}

export function unknownAsError(error: unknown): Error {
  if (error instanceof Error) return error
  if (typeof error === 'string') return new Error(error)
  return new Error(`Error: ${error}`)
}

export class ErrorWithDetails extends Error {
  readonly details: unknown

  constructor(message: string, options: ErrorOptions & { details: unknown }) {
    super(message, options)
    this.details = options.details
  }

  toString() {
    return `${this.name}: ${this.message} ${JSON.stringify(this.details)}`
  }
}
