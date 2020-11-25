import { NotFoundException } from "@nestjs/common"

export function nullable<T>(message: string): (o: T | undefined) => T {
  return (_: T | undefined) => {
    if (_) return _!
    throw new NotFoundException(message)
  }
}
