export function parseInt10OrThrow(value: unknown): number {
  const valid = validNumber(value)
  if (valid && typeof value === 'number') return value
  if (valid && typeof value === 'string') return parseInt10(value)

  throw new Error(`Expected ${value} to be a number / convertible to a number`)
}

/**
 * Checks if the value is a number or a string that can be converted to a whole number
 *
 * Examples:
 *
 * -1, 0, 1, 2, 3, 5.3, 0.1, -12.53 => true
 * -0.4, 0.2 => true
 *
 * "-1", "0", "1", "2", "3" => true
 * "0.2", "0.4" => false
 *
 * NaN, Infinity, -Infinity, "NaN", "Infinity", "-Infinity" => false
 **/
export function validNumber(num: unknown): num is number | string {
  if (typeof num === 'number') return Number.isFinite(num)
  if (typeof num !== 'string') return false

  return !!num && num.toString() !== 'NaN' && parseInt10(num.toString()).toString() === num.toString()
}

export function parseInt10(num: string) {
  return parseInt(num, 10)
}

export function minAndMax(a: number, b: number): [number, number] {
  return a <= b ? [a, b] : [b, a]
}
