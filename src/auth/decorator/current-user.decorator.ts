import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { plainToClass } from "class-transformer"

export const CurrentUser = createParamDecorator(
  (dataOrPipe: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return plainToClass(UserInfoEntity, request.user)
  }
)
