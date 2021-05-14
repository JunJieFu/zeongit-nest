import { NotFoundException } from "@nestjs/common"

export function nullable<T>(message: string) {
  return (_: T | undefined) => {
    if (_ !== undefined) return _
    throw new NotFoundException(undefined, message)
  }
}
