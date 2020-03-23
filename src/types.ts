export type UUID = string

const DEFAULT_MESSAGE = 'Object should not be undefined.'

export function ensure<T>(thing: T | undefined, message: string = DEFAULT_MESSAGE): T {
  if (!thing) throw new Error(message)
  return thing
}
