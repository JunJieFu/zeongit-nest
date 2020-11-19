import { HttpStatus } from "@nestjs/common"

export class Result<T> {
  status: HttpStatus = HttpStatus.OK
  message?: string
  data?: T

  constructor(
    status: HttpStatus = HttpStatus.OK,
    message?: string,
    data?: T
  ) {
    this.status = status
    this.message = message
    this.data = data
  }
}
