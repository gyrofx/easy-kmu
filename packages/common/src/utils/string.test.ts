import { removeAccentsAndSpecialCharacters, splitTrimTruthy, summarizeStringTo } from './string'

describe('summarizeStringTo', () => {
  it.each([1, 10, 100, 199, 200, 201, 202, 203, 204, 300, 1000, 10000])(
    'summarizes a string of length %s to 200 characters',
    (length) => expect(summarizeStringTo(generateStringOfLength(length), 200)).toMatchSnapshot(),
  )

  it.each([1, 10, 100, 199, 200, 201, 202, 203, 204, 300, 1000, 10000])(
    'summarizes a string of length %s to 250 characters',
    (length) => expect(summarizeStringTo(generateStringOfLength(length), 250)).toMatchSnapshot(),
  )

  it.each([1, 10, 100, 199, 200, 201, 202, 203, 204, 300, 1000, 10000])(
    'throws an error if an invalid length is supplied with a string of length %s',
    (length) => expect(() => summarizeStringTo(generateStringOfLength(length), 150)).toThrow(),
  )
})

describe('splitTrimTruthy', () => {
  it.each([
    ['a, b, c', ',', ['a', 'b', 'c']],
    ['a, , c', ',', ['a', 'c']],
    ['a: : c: : :: :', ':', ['a', 'c']],
  ])('splits a string of %s by %s to %s', (text, split, expected) => {
    expect(splitTrimTruthy(text, split)).toEqual(expected)
  })
})

describe('removeAccentsAndSpecialCharacters', () => {
  it.each([
    ['abc', 'abc', '-'],
    ['a b c', 'a-b-c', '-'],
    ['a b c', 'a_b_c', '_'],
    ['a b c', 'a b c', ' '],
    ['     a   b         c   ', 'a.b.c', '.'],
    ['a,b,c', 'a-b-c', '-'],
    ['1234+20:00', '1234-20-00', '-'],
    ['äöü', 'aou', '-'],
    ['a, b, c', 'a-b-c', '-'],
    ['a/b/c', 'a-b-c', '-'],
  ])('removes accents from %s to %s', (text, expected, replaceWith) => {
    expect(removeAccentsAndSpecialCharacters(text, replaceWith)).toEqual(expected)
  })
})

function generateStringOfLength(length: number) {
  return someLongString.repeat(Math.ceil(length / someLongString.length) + 1).slice(0, length)
}

const someLongString =
  'abcdefg1234567qn80hcfnq203urvqv27yr3bhfq8327ryvfqcru809q23utgn9aw8ugjaw3hg8465469846541a69g48w3ewh3gw3hgw3gh9jawh30jgUOYNNUHBGYVTYFBHUNJWDIQJPMOIWFEHWEGWNEGINOJPIEGWFHEWE*GUH*WG#UFEIJNWIOEGJN(#U*G(W#$&^T&%*R&#(*Y@R(FYGHNEBWWGINUWEGIUH#(@G*NHUNWIEGFHIWEUGHFNWIEGUH(#*GHN(IUWESHGB*#&GHN(@GJOPIEGJ(*G$J@NPWOGJIWEMG)(#$GJM)W#GIJMWEG)(*#UGJN)J@#JGM)'
