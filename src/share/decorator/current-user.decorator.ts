import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { UserInfoEntity } from "../../data/entity/user-info.entity"
import { plainToClass } from "class-transformer"

export const CurrentUser = createParamDecorator(
  (dataOrPipe: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    console.log(request.user)
    return plainToClass(UserInfoEntity, request.user)
  }
)
