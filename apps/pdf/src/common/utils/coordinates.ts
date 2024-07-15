export function rawDistance(a: Readonly<[number, number]>, b: Readonly<[number, number]>) {
  return distance({ x: a[0], y: a[1] }, { x: b[0], y: b[1] })
}

export function distance(a: Coordinate, b: Coordinate) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export function addCoordinate(a: Coordinate, b: Coordinate): Coordinate {
  return { x: a.x + b.x, y: a.y + b.y }
}

/**
 * Extracts coordinates from a data structure, recognizes coordinates by their format {x: number, y: number}
 */
export function extractCoordinates(data: unknown): Coordinate[] {
  return Array.isArray(data)
    ? data.flatMap(extractCoordinates)
    : isCoordinate(data)
    ? [data]
    : data && typeof data === 'object'
    ? extractCoordinates(Object.values(data))
    : []
}

export function isCoordinate(data: unknown): data is Coordinate {
  return (
    typeof data === 'object' &&
    !!data &&
    Object.keys(data).length === 2 &&
    'x' in data &&
    'y' in data &&
    typeof (data as any).x === 'number' &&
    typeof (data as any).y === 'number'
  )
}

export interface Coordinate {
  x: number
  y: number
}
