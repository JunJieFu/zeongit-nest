import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { CallHandler, CanActivate, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common"
import { AuthService } from "../service/auth.service"
import { jwtConfigType } from "../config"
import { ConfigType } from "@nestjs/config"
import { Payload } from "../model/payload.model"
import { AuthException } from "../../share/exception/Auth.exception"
import { JwtService } from "@nestjs/jwt"
import { map } from "rxjs/operators"

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(@Inject(jwtConfigType.KEY)
//               private jwtConfig: ConfigType<typeof jwtConfigType>,
//               private readonly authService: AuthService,
//               private readonly jwtService: JwtService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConfig.secretKey
//     })
//   }
//
//   async validate({ id, createdTime }: Payload) {
//     console.log()
//     const user = await this.authService.get(id)
//     if (user.updateDate!.getTime() > createdTime) throw  new AuthException("请重新登录")
//     return this.authService.getInfo(id)
//   }
// }
//


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
      console.log(this.jwtConfig)
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
