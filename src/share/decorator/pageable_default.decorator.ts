import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { Pageable } from "../model/pageable.model"

export const PageableDefault = createParamDecorator(
  (pageable: { size: number } | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>()
    return new Pageable(request.query, pageable)
  }
)
