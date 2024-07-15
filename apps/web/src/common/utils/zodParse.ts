import { z } from 'zod'
import { ErrorWithDetails } from './errors'
import { createRedactedObject, redactedPlaceholder } from './json'

export function zodParse<T extends z.ZodTypeAny>(schema: T, object: unknown): z.infer<T> {
  return zodParseInternal(schema, object, { logInvalidObject: false })
}

export function zodParseAndLogInvalidObject<T extends z.ZodTypeAny>(
  schema: T,
  object: unknown
): z.infer<T> {
  return zodParseInternal(schema, object, { logInvalidObject: true })
}

function zodParseInternal<T extends z.ZodTypeAny>(
  schema: T,
  object: unknown,
  options: { logInvalidObject: boolean }
): z.infer<T> {
  const result = schema.safeParse(object)
  if (result.success) return result.data

  throw objectWithErrorDetailsAndInvalidObject(result.error, object, options)
}

function objectWithErrorDetailsAndInvalidObject(
  cause: z.ZodError<unknown>,
  invalidObject: unknown,
  { logInvalidObject }: { logInvalidObject: boolean }
) {
  return new ErrorWithDetails(`zod failed to parse object: ${cause.message}`, {
    details: {
      issues: cause.issues,
      zodName: cause.name,
      zodMessage: cause.message,
      invalidObject: logInvalidObject ? createRedactedObject(invalidObject) : redactedPlaceholder,
    },
    cause,
  })
}
