import { times } from 'lodash'
import {
  allOrNone,
  findObjectAndIndex,
  firstOrThrow,
  isAtLeastLength,
  isLength,
  isNonempty,
  lastOrThrow,
  neighbors,
  removeFirst,
  removeLast,
  sortByLowerCase,
  truthy,
  withPreviousAndNext,
} from './array'

describe('truthy', () => {
  it.each([true, 1, 'x', {}, []])('%s is true', (value) => void expect(truthy(value)).toBe(true))
  it.each([false, 0, '', undefined, null])(
    '%s is false',
    (value) => void expect(truthy(value)).toBe(false),
  )
})

describe('isNonempty', () => {
  it('is empty', () => expect(isNonempty([])).toBe(false))
  it('is not empty', () => expect(isNonempty([0])).toBe(true))
})

describe('length', () => {
  it.each(times(5))(
    'array of length %s that length',
    (value) => void expect(isLength(times(value), value)).toBe(true),
  )
  it.each(times(5))(
    'array of length %s not length + 1',
    (value) => void expect(isLength(times(value), value + 1)).toBe(false),
  )
})

describe('removeFirst', () => {
  it.each([
    {
      array: [1, 2, 3] as any[],
      predicate: (value: number) => value === 2,
      removedValue: 2,
      expectedArray: [1, 3],
    },
    {
      array: [1, 2, 3] as any[],
      predicate: truthy,
      removedValue: 1,
      expectedArray: [2, 3],
    },
    {
      array: [1, 2, 3] as any[],
      predicate: () => false,
      removedValue: undefined,
      expectedArray: [1, 2, 3],
    },
    {
      array: [{ x: 1, y: 2 }, { x: 2 }, { x: 1, y: 42 }] as any[],
      predicate: ({ x }: any) => x === 1,
      removedValue: { x: 1, y: 2 },
      expectedArray: [{ x: 2 }, { x: 1, y: 42 }],
    },
  ])('returns $removedValue, and changes $array to $expectedArray using $predicate', (props) => {
    const { array, predicate, removedValue, expectedArray } = props
    expect(removeFirst(array, predicate)).toEqual(removedValue)
    expect(array).toEqual(expectedArray)
  })
})

describe('removeLast', () => {
  it.each([
    {
      array: [1, 2, 3] as any[],
      predicate: (value: number) => value === 2,
      removedValue: 2,
      expectedArray: [1, 3],
    },
    {
      array: [1, 2, 3] as any[],
      predicate: truthy,
      removedValue: 3,
      expectedArray: [1, 2],
    },
    {
      array: [1, 2, 3] as any[],
      predicate: () => false,
      removedValue: undefined,
      expectedArray: [1, 2, 3],
    },
    {
      array: [{ x: 1, y: 2 }, { x: 2 }, { x: 1, y: 42 }] as any[],
      predicate: ({ x }: any) => x === 1,
      removedValue: { x: 1, y: 42 },
      expectedArray: [{ x: 1, y: 2 }, { x: 2 }],
    },
  ])('returns $removedValue, and changes $array to $expectedArray using $predicate', (props) => {
    const { array, predicate, removedValue, expectedArray } = props
    expect(removeLast(array, predicate)).toEqual(removedValue)
    expect(array).toEqual(expectedArray)
  })
})

describe('withPreviousAndNext', () => {
  it.each([[[1, 2, 3]], [[]], [[1]], [times(10).map((x) => (x + 1) * 10)]])(
    'returns previous and next values for %p',
    (array) => expect(withPreviousAndNext(array)).toMatchSnapshot(),
  )
})

it('neighbors', () => {
  expect(neighbors([])).toEqual([])
  expect(neighbors([0])).toEqual([])
  expect(neighbors([0, 1])).toEqual([[0, 1]])
  expect(neighbors([0, 1, 2])).toEqual([
    [0, 1],
    [1, 2],
  ])
  expect(neighbors([0, 1, 2, 3, 4])).toEqual([
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
  ])
})

it('findWithIndex', () => {
  const array = [{ a: 1 }, { a: 2 }, { a: 3 }]

  expect(findObjectAndIndex(array, (value) => value.a === 2)).toEqual([{ a: 2 }, 1])
  expect(findObjectAndIndex(array, (value) => value.a === 10)).toEqual([undefined, -1])

  expect(findObjectAndIndex(array, (value) => value.a === 2)[0]).toBe(array[1])
})

it('isAtLeastLength', () => {
  expect(isAtLeastLength([], 1)).toBe(false)
  expect(isAtLeastLength([1], 1)).toBe(true)
  expect(isAtLeastLength([1, 2], 1)).toBe(true)
  expect(isAtLeastLength([1, 2, 3], 1)).toBe(true)

  expect(isAtLeastLength([], 3)).toBe(false)
  expect(isAtLeastLength([1], 3)).toBe(false)
  expect(isAtLeastLength([1, 2], 3)).toBe(false)
  expect(isAtLeastLength([1, 2, 3], 3)).toBe(true)
  expect(isAtLeastLength([1, 2, 3, 4], 3)).toBe(true)
})

describe('firstOrThrow', () => {
  it('gets the first element of the array', () => {
    expect(firstOrThrow([1, 2, 3])).toBe(1)
  })
  it('throws an error with an empty array', () => {
    expect(() => firstOrThrow([])).toThrow()
  })
})

describe('lastOrThrow', () => {
  it('gets the last element of the array', () => {
    expect(lastOrThrow([1, 2, 3])).toBe(3)
  })
  it('throws an error with an empty array', () => {
    expect(() => lastOrThrow([])).toThrow()
  })
})

describe('allOrNone', () => {
  const throwError = () => new Error()
  const oneTwoThree = [1, 2, 3]

  it('is false for an empty array', () => {
    expect(allOrNone([], truthy, throwError)).toBe(false)
    expect(allOrNone([], () => false, throwError)).toBe(false)
  })
  it('is true if all elements match the predicate', () => {
    expect(allOrNone(oneTwoThree, (n) => n > 0, throwError)).toBe(true)
  })
  it('is false if no elements match the predicate', () => {
    expect(allOrNone(oneTwoThree, (n) => n < 0, throwError)).toBe(false)
  })
  it("throws an error if some match and some don't match the predicate", () => {
    expect(() => allOrNone(oneTwoThree, (n) => n <= 2, throwError)).toThrow()
  })
})

describe('sortByLowerCase', () => {
  it('sorts an array', () => {
    expect(sortByLowerCase(['a', 'b', 'A', 'C', 'd'])).toEqual(['a', 'A', 'b', 'C', 'd'])
  })
})
