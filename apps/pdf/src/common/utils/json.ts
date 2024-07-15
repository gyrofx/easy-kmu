export function prettyJson(value: any) {
  return JSON.stringify(value, null, ' ')
}

export function parseOrUndefined(text: string | null | undefined): unknown | undefined {
  return text ? JSON.parse(text) : undefined
}

/**
 * Removes sensitive keys (e.g. "password") from objects.
 * Useful to prevent leaking secrets when logging.
 */
export function createRedactedObject<T>(object: T): T {
  return object === undefined
    ? undefined
    : object === null
    ? null
    : typeof object === 'string'
    ? object
    : JSON.parse(redactedStringify(object))
}

function redactedStringify(object: unknown) {
  return JSON.stringify(object, (key, value) =>
    redactedKeys.includes(key) ? redactedPlaceholder : value
  )
}

export const redactedPlaceholder = '[REDACTED]'
const redactedKeys = ['password', 'passcode', 'displayName']
