import { parseISO } from 'date-fns'
import { z } from 'zod'
import { forceArray, zodISODateStringToDate, zodOptionalISODateStringToDate } from './zodHelper'
import { zodParse } from './zodParse'

describe('forceArray', () => {
  const schema = forceArray(z.object({ foo: z.string() }))

  it('parses a single value and returns an array', () => {
    const parsed = zodParse(schema, { foo: 'bar' })
    expect(parsed).toEqual([{ foo: 'bar' }])
  })

  it('parses an array value and returns an array', () => {
    const parsed: { foo: string }[] = zodParse(schema, [{ foo: 'bar' }])
    expect(parsed).toEqual([{ foo: 'bar' }])
  })

  it('parses multiple values', () => {
    const parsed = zodParse(schema, [{ foo: 'bar' }, { foo: 'baz' }, { foo: 'test' }])
    expect(parsed).toEqual([{ foo: 'bar' }, { foo: 'baz' }, { foo: 'test' }])
  })

  it('parses undefined and throws an error', () => {
    expect(() => zodParse(schema, undefined)).toThrow()
  })
})

describe('dates', () => {
  const date = '2022-10-20T01:42:51.699Z'

  describe('optional date', () => {
    it('parses a date', () => {
      const parsed = zodParse(zodOptionalISODateStringToDate(), date)
      expect(parsed).toEqual(parseISO(date))
      expect(parsed).toBeInstanceOf(Date)
    })

    it('parses undefined', () => {
      expect(zodParse(zodOptionalISODateStringToDate(), undefined)).toBeUndefined()
    })

    const invalidISOStrings = [
      '2023-04-1714:53:39.548Z',
      '23/2/2017',
      'invalid',
      'invalid',
      'invalid',
      '2021-02-29',
      '2021-01-33',
      'invalid',
    ]

    it.each(invalidISOStrings)('does not parse invalid date', async (invalidString) => {
      expect(() => zodParse(zodOptionalISODateStringToDate(), invalidString)).toThrow()
    })
  })

  describe('required date', () => {
    it('parses a date', () => {
      const parsed = zodParse(zodISODateStringToDate(), date)
      expect(parsed).toEqual(parseISO(date))
      expect(parsed).toBeInstanceOf(Date)
    })

    it('throws on undefined', () => {
      expect(() => zodParse(zodISODateStringToDate(), undefined)).toThrow()
    })
  })
})
