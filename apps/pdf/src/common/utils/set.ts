export function toggleSetValue<T>(set: Set<T>, value: T): Set<T> {
  if (set.has(value)) {
    set.delete(value)
  } else {
    set.add(value)
  }
  return new Set([...set])
}
