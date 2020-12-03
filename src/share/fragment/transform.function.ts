export const parseArrayTransformFn = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
  } else {
    if (value !== undefined) {
      return [value]
    } else {
      return []
    }
  }
}
