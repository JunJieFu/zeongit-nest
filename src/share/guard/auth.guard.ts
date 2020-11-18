import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Request } from "express"
import { Reflector } from "@nestjs/core"
import { NestResponse } from "../types"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): NestResponse<boolean> {
    const roles = this.reflector.get<string[]>("roles", context.getHandler())
    console.log(roles)
    const request = context.switchToHttp().getRequest<Request>()
    ;(request as any).user = "456"
    return true
  }
}
