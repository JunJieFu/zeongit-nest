export const parseArrayTransformFn = (value: any) => {
  if (Array.isArray(value)) {
    return value
  } else {
    return [value]
  }
}
