export type UUID = string

export function ensure<T>(thing: T | undefined): T {
  if (!thing) throw new Error('Object should not be undefined.')
  return thing
}
