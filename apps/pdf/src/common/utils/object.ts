export function filterObject(obj: Record<string, any>, predicate: (key: string, value: any) => boolean) {
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => predicate(key, value)))
}
