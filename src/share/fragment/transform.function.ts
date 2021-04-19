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

export const parseBooleanTransformFn = (value: unknown) => {
  return typeof value === "string" && value === "true"
}
