import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { Pageable } from "../model/pageable.model"

export const PageableDefault = createParamDecorator(
  (pageable: { limit: number } | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return new Pageable(request.query as any, pageable)
  }
)
