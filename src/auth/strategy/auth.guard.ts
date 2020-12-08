import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthException } from "../../share/exception/auth.exception"

@Injectable()
export class AuthGuard implements CanActivate {

  async canActivate(
    context: ExecutionContext
  ) {
    const request = context.switchToHttp().getRequest()
    if (!request.user) {
      throw  new AuthException("请重新登录")
    }
    return true
  }
}
