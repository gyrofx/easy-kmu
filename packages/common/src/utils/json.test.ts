import { createRedactedObject, parseOrUndefined, prettyJson } from './json'

describe('prettyJson', () => {
  it('formats a simple json file', () => {
    expect(prettyJson({ a: 1, b: 2 })).toMatchSnapshot()
  })

  it('formats a complex json file', () => {
    expect(prettyJson({ a: { b: { c: [1, 2] }, d: 'bla bla bla', e: null } })).toMatchSnapshot()
  })
})

describe('parseOrUndefined', () => {
  it('parses null', () => {
    expect(parseOrUndefined(null)).toBeUndefined()
  })

  it('parses undefined', () => {
    expect(parseOrUndefined(undefined)).toBeUndefined()
  })

  it('parses a json string', () => {
    expect(parseOrUndefined(JSON.stringify({ a: 1, b: 2 }))).toEqual({ a: 1, b: 2 })
  })

  it('parses a simple json string to a string', () => {
    expect(
      parseOrUndefined(JSON.stringify(JSON.stringify({ a: 1, b: 2 }).slice(0, 8))),
    ).toMatchInlineSnapshot(`"{"a":1,""`)
  })
})

describe('createRedactedObject', () => {
  it('redacts a password field', () => {
    expect(
      createRedactedObject({ uid: 'abcd1234', password: 'should be censored' }),
    ).toMatchInlineSnapshot(`
        {
          "password": "[REDACTED]",
          "uid": "abcd1234",
        }
      `)
  })

  it('redacts the display name', () => {
    expect(
      createRedactedObject({ uid: 'abcd1234', displayName: 'should be censored' }),
    ).toMatchInlineSnapshot(`
        {
          "displayName": "[REDACTED]",
          "uid": "abcd1234",
        }
      `)
  })

  it('redacts multiple passwords', () => {
    expect(
      createRedactedObject([
        { uid: 'abcd1234', password: 'should be censored' },
        { uid: 'xyz', password: 'should also be censored' },
      ]),
    ).toMatchInlineSnapshot(`
      [
        {
          "password": "[REDACTED]",
          "uid": "abcd1234",
        },
        {
          "password": "[REDACTED]",
          "uid": "xyz",
        },
      ]
    `)
  })

  it('redacts a password field in a nested object', () => {
    expect(
      createRedactedObject({ uid: 'abcd1234', data: { password: 'should be censored' } }),
    ).toMatchInlineSnapshot(`
        {
          "data": {
            "password": "[REDACTED]",
          },
          "uid": "abcd1234",
        }
      `)
  })

  it('works with undefined', () => {
    expect(createRedactedObject(undefined)).toBeUndefined()
  })

  it('works with null', () => {
    expect(createRedactedObject(null)).toBeNull()
  })

  it('does not redact a string', () => {
    expect(createRedactedObject('this is not a password')).toMatchInlineSnapshot(
      `"this is not a password"`,
    )
  })
})
