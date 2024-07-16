import { defined } from './array'
import { filterObject } from './object'

describe('filterObject', () => {
  const obj = {
    a: 10,
    b: 'test',
    c: true,
    d: undefined,
  }

  it('filters by value', () => {
    expect(filterObject(obj, (_key: string, value: any) => value === 10)).toEqual({ a: 10 })
    expect(filterObject(obj, (_key: string, value: any) => defined(value))).toEqual({
      a: 10,
      b: 'test',
      c: true,
    })
  })

  it('filters by key', () => {
    const keys = ['a', 'b']
    expect(filterObject(obj, (key: string, _value: any) => keys.includes(key))).toEqual({
      a: 10,
      b: 'test',
    })
  })

  it('filters by key and value', () => {
    const keys = ['a', 'b']
    expect(
      filterObject(obj, (key: string, value: any) => keys.includes(key) && typeof value === 'number'),
    ).toEqual({
      a: 10,
    })
  })
})
