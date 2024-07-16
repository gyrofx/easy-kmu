import { minAndMax, parseInt10, parseInt10OrThrow, validNumber } from './number'

describe('parseInt10OrThrow', () => {
  it.each([1, 10, -340934, 0.2, -5.3])('parses %s to a number', (spec) =>
    expect(parseInt10OrThrow(spec)).toEqual(spec),
  )

  it.each([
    { input: '0', output: 0 },
    { input: '5334234', output: 5334234 },
    { input: '-444444', output: -444444 },
  ])('parses the the input to output %s', (spec) =>
    expect(parseInt10OrThrow(spec.input)).toEqual(spec.output),
  )

  it.each([
    '9999999999999999999999999999',
    '',
    'bla',
    '1a',
    -Infinity,
    NaN,
    null,
    undefined,
    {},
    { bla: 1 },
  ])('%s is not a valid number', (number) => expect(() => parseInt10OrThrow(number)).toThrow())
})

describe('validNumber', () => {
  it.each([1, 10, -340934, '0', '5334234', '-444444'])(
    '%s is a valid number',
    (number) => void expect(validNumber(number)).toBe(true),
  )

  it.each([
    '9999999999999999999999999999',
    '',
    'bla',
    '1a',
    -Infinity,
    NaN,
    null,
    undefined,
    {},
    { bla: 1 },
  ])('%s is not a valid number', (number) => void expect(validNumber(number)).toBe(false))
})

describe('parseInt10', () => {
  it('parses an int', () => expect(parseInt10('1234')).toBe(1234))
  it('parses an int with leading 0', () => expect(parseInt10('023')).toBe(23))
  it('parses an int with leading 0x', () => expect(parseInt10('0x34')).toBe(0))
})

describe('minAndMax', () => {
  it('leaves the original order', () => expect(minAndMax(1, 2)).toEqual([1, 2]))
  it('changes the order', () => expect(minAndMax(2, 1)).toEqual([1, 2]))
  it('works with two equal numbers', () => expect(minAndMax(3, 3)).toEqual([3, 3]))
})
