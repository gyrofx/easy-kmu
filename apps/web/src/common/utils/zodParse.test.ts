import { z } from 'zod'
import { catchErrorForTest } from './testHelpers'
import { zodParse, zodParseAndLogInvalidObject } from './zodParse'

describe('zodParse', () => {
  const schema = z.object({ foo: z.string() })
  describe('with valid input', () => {
    it('parses without error and correct type', () => {
      const parsed = zodParse(schema, { foo: 'bar' })
      expect(parsed).toMatchInlineSnapshot(`
        {
          "foo": "bar",
        }
      `)
    })
  })

  describe('with invalid input', () => {
    it('throws error with object attached', () => {
      const input = { baz: 'bar' }
      expect(catchErrorForTest(() => zodParse(schema, input))).toMatchInlineSnapshot(`
        {
          "cause": {
            "cause": "",
            "details": undefined,
            "message": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "foo"
            ],
            "message": "Required"
          }
        ]",
            "name": "ZodError",
            "stack": undefined,
            "stringified": undefined,
            "type": "error",
          },
          "details": {
            "invalidObject": "[REDACTED]",
            "issues": [
              {
                "code": "invalid_type",
                "expected": "string",
                "message": "Required",
                "path": [
                  "foo",
                ],
                "received": "undefined",
              },
            ],
            "zodMessage": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "foo"
            ],
            "message": "Required"
          }
        ]",
            "zodName": "ZodError",
          },
          "message": "zod failed to parse object: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "foo"
            ],
            "message": "Required"
          }
        ]",
          "name": "Error",
          "stack": undefined,
          "stringified": undefined,
          "type": "error",
        }
      `)
    })

    it('filters sensitive keys in attached object', () => {
      const input = { foo: { password: 'bar' } }
      expect(catchErrorForTest(() => zodParse(schema, input))).toMatchInlineSnapshot(`
        {
          "cause": {
            "cause": "",
            "details": undefined,
            "message": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [
              "foo"
            ],
            "message": "Expected string, received object"
          }
        ]",
            "name": "ZodError",
            "stack": undefined,
            "stringified": undefined,
            "type": "error",
          },
          "details": {
            "invalidObject": "[REDACTED]",
            "issues": [
              {
                "code": "invalid_type",
                "expected": "string",
                "message": "Expected string, received object",
                "path": [
                  "foo",
                ],
                "received": "object",
              },
            ],
            "zodMessage": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [
              "foo"
            ],
            "message": "Expected string, received object"
          }
        ]",
            "zodName": "ZodError",
          },
          "message": "zod failed to parse object: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [
              "foo"
            ],
            "message": "Expected string, received object"
          }
        ]",
          "name": "Error",
          "stack": undefined,
          "stringified": undefined,
          "type": "error",
        }
      `)
    })
  })
})

describe('zodParseAndLog', () => {
  const schema = z.object({ foo: z.string() })
  describe('with valid input', () => {
    it('parses without error and correct type', () => {
      const parsed = zodParseAndLogInvalidObject(schema, { foo: 'bar' })
      expect(parsed).toMatchInlineSnapshot(`
        {
          "foo": "bar",
        }
      `)
    })
  })

  describe('with invalid input', () => {
    it('throws error with object attached', () => {
      const input = { baz: 'bar' }
      expect(catchErrorForTest(() => zodParseAndLogInvalidObject(schema, input))).toMatchInlineSnapshot(`
        {
          "cause": {
            "cause": "",
            "details": undefined,
            "message": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "foo"
            ],
            "message": "Required"
          }
        ]",
            "name": "ZodError",
            "stack": undefined,
            "stringified": undefined,
            "type": "error",
          },
          "details": {
            "invalidObject": {
              "baz": "bar",
            },
            "issues": [
              {
                "code": "invalid_type",
                "expected": "string",
                "message": "Required",
                "path": [
                  "foo",
                ],
                "received": "undefined",
              },
            ],
            "zodMessage": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "foo"
            ],
            "message": "Required"
          }
        ]",
            "zodName": "ZodError",
          },
          "message": "zod failed to parse object: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "undefined",
            "path": [
              "foo"
            ],
            "message": "Required"
          }
        ]",
          "name": "Error",
          "stack": undefined,
          "stringified": undefined,
          "type": "error",
        }
      `)
    })

    it('filters sensitive keys in attached object', () => {
      const input = { foo: { password: 'bar' } }
      expect(catchErrorForTest(() => zodParseAndLogInvalidObject(schema, input))).toMatchInlineSnapshot(`
        {
          "cause": {
            "cause": "",
            "details": undefined,
            "message": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [
              "foo"
            ],
            "message": "Expected string, received object"
          }
        ]",
            "name": "ZodError",
            "stack": undefined,
            "stringified": undefined,
            "type": "error",
          },
          "details": {
            "invalidObject": {
              "foo": {
                "password": "[REDACTED]",
              },
            },
            "issues": [
              {
                "code": "invalid_type",
                "expected": "string",
                "message": "Expected string, received object",
                "path": [
                  "foo",
                ],
                "received": "object",
              },
            ],
            "zodMessage": "[
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [
              "foo"
            ],
            "message": "Expected string, received object"
          }
        ]",
            "zodName": "ZodError",
          },
          "message": "zod failed to parse object: [
          {
            "code": "invalid_type",
            "expected": "string",
            "received": "object",
            "path": [
              "foo"
            ],
            "message": "Expected string, received object"
          }
        ]",
          "name": "Error",
          "stack": undefined,
          "stringified": undefined,
          "type": "error",
        }
      `)
    })
  })
})
