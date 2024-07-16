import { assertNonNullish, nonNullish } from './asserts'

describe('assertNonNullish', () => {
  it('throws if value is null', () => {
    expect(() => assertNonNullish(null, 'is nullish')).toThrow()
  })

  it('throws if value is undefined', () => {
    expect(() => assertNonNullish(undefined, 'is nullish')).toThrow()
  })

  it('accepts primitives', () => {
    expect(() => assertNonNullish(12, 'is nullish')).not.toThrow()
    expect(() => assertNonNullish(false, 'is nullish')).not.toThrow()
    expect(() => assertNonNullish('test', 'is nullish')).not.toThrow()
  })

  it('accepts an empty object', () => {
    expect(() => assertNonNullish({}, 'is nullish')).not.toThrow()
  })

  it('accepts an empty array', () => {
    expect(() => assertNonNullish([], 'is nullish')).not.toThrow()
  })

  it('accepts an function', () => {
    expect(() => assertNonNullish(expect, 'is nullish')).not.toThrow()
  })
})

describe('nonNullish', () => {
  it('throws if value is null', () => {
    expect(nonNullish(null)).toBe(false)
  })

  it('throws if value is undefined', () => {
    expect(nonNullish(undefined)).toBe(false)
  })

  it('accepts primitives', () => {
    expect(nonNullish(12)).toBe(true)
    expect(nonNullish(false)).toBe(true)
    expect(nonNullish('test')).toBe(true)
  })

  it('accepts an empty object', () => {
    expect(nonNullish({})).toBe(true)
  })

  it('accepts an empty array', () => {
    expect(nonNullish([])).toBe(true)
  })

  it('accepts an function', () => {
    expect(nonNullish(expect)).toBe(true)
  })
})
