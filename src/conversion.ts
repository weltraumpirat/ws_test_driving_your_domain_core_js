
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toData<T>(item: any): T {
  if (Array.isArray(item)) {
    return item.length > 0 ? item.map(n => toData(n)) as unknown as T : [] as unknown as T
  } else if (typeof item === 'string') {
    return item as unknown as T
  } else if (item instanceof Date) {
    return item as unknown as T
  } else if (typeof item === 'number') {
    return item as unknown as T
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ret: Record<string, any> = {}
    for (let key in item) {
      if (key.indexOf('_') === -1 && item.hasOwnProperty(key)) {
        ret[key] = typeof item[key] === 'object' ? toData(item[key]) : item[key]
      }
    }
    return ret as T
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
export function toJson(item: any): string {
  return JSON.stringify(toData(item))
}
