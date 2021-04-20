import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { plainToClass } from "class-transformer"
import { Request } from "express"

export const CurrentUser = createParamDecorator(
  (dataOrPipe: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return plainToClass(UserInfoEntity, request.user)
  }
)
