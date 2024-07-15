import { remove } from 'remove-accents'

/**
 * Trims `text` to a `maxLength`, but keeps the first and last couple of
 * characters. The `maxLength` must be greater than 200 to have an effect
 */
export function summarizeStringTo(text: string, maxLength: number) {
  if (maxLength < 200) throw new Error(`maxLength must be at least 200, got ${maxLength}`)

  if (typeof text !== 'string' || text.length <= maxLength) return text

  const cushionLength = 100
  const startAndEndLengths = Math.floor((maxLength - cushionLength) / 2)
  const start = text.slice(0, startAndEndLengths)
  const end = text.slice(-startAndEndLengths)
  return `[Summarized string of length ${text.length}]: ${start} [...] ${end}`
}

/**
 * @examples
 * removeAccentsAndSpecialCharacters('abc') // 'abc'
 * removeAccentsAndSpecialCharacters('a b c') // 'a-b-c'
 * removeAccentsAndSpecialCharacters('a b c', '_') // 'a_b_c'
 * removeAccentsAndSpecialCharacters('a b c', ' ') // 'a b c'
 * removeAccentsAndSpecialCharacters('     a   b         c   ', '.') // 'a.b.c'
 * removeAccentsAndSpecialCharacters('a,b,c') // 'a-b-c'
 * removeAccentsAndSpecialCharacters('a/b/c') // 'a-b-c'
 */
export function removeAccentsAndSpecialCharacters(text: string, replaceWith = '-') {
  const newText = remove(text)
    .normalize('NFKD')
    .replaceAll(/[^a-zA-Z0-9]/g, ' ')
  return splitTrimTruthy(newText, ' ').join(replaceWith)
}

/**
 * Splits `text` by `split`, trims each part, and removes any empty parts
 * @examples
 * splitTrimTruthy('a, b, c', ',') // ['a', 'b', 'c']
 * splitTrimTruthy('a, , c', ',') // ['a', 'c']
 * splitTrimTruthy('a: : c: : :: :', ':') // ['a', 'c']
 **/
export function splitTrimTruthy(text: string, split: string) {
  return text
    .split(split)
    .map((s) => s.trim())
    .filter((t) => t)
}
