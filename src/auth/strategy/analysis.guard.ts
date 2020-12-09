import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common"
import { AuthService } from "../service/auth.service"
import { jwtConfigType } from "../config"
import { ConfigType } from "@nestjs/config"
import { Payload } from "../model/payload.model"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AnalysisGuard implements CanActivate {
  constructor(@Inject(jwtConfigType.KEY)
              private jwtConfig: ConfigType<typeof jwtConfigType>,
              private readonly authService: AuthService,
              private readonly jwtService: JwtService) {
  }

  async canActivate(
    context: ExecutionContext
  ) {
    try {
      const request = context.switchToHttp().getRequest()
      const { id, createdTime }: Payload = this.jwtService.verify(request.headers?.authorization?.split("Bearer ")[1], {
        ignoreExpiration: false,
        secret: this.jwtConfig.secretKey
      })
      const user = await this.authService.get(id)
      if (user.updateDate!.getTime() <= createdTime) {
        request.user = await this.authService.getInfo(id)
      }
    } catch (e) {
    }
    return true
  }
}