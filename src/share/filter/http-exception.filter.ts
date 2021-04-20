import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common"
import { Result } from "../model/result.model"
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    let message
    if (exception instanceof BadRequestException) {
      message = (exception.getResponse() as any).message[0]
    } else if (exception instanceof HttpException) {
      message = exception.message
    }
    console.log(exception)
    response.status(HttpStatus.OK).json(
      new Result(status, message ?? "服务器错误", {
        timestamp: new Date().toISOString(),
        path: request.url
      })
    )
  }
}
