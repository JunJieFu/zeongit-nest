import { HttpException, HttpStatus } from "@nestjs/common"

export class PermissionException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN)
  }
}
