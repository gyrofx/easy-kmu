export function timeZoneExists(timeZone: string) {
  if (!timeZone) return false

  try {
    Intl.DateTimeFormat(undefined, { timeZone })
    return true
  } catch {
    return false
  }
}
