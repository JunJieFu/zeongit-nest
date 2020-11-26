import { NotFoundException } from "@nestjs/common"
import { map } from "rxjs/operators"

export function nullable<T>(message: string) {
  return map((_: T | undefined) => {
    if (_ !== undefined) return _!
    throw new NotFoundException(message)
  })
}
