import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Inject, Injectable } from "@nestjs/common"
import { AuthService } from "../service/auth.service"
import { jwtConfigType } from "../config"
import { ConfigType } from "@nestjs/config"
import { Payload } from "../model/payload.model"
import { AuthException } from "../../share/exception/Auth.exception"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfigType.KEY)
              private jwtConfig: ConfigType<typeof jwtConfigType>,
              private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretKey
    })
  }

  async validate({ id, createdTime }: Payload) {
    const user = await this.authService.get(id)
    console.log(user)
    if (user.updateDate!.getTime() > createdTime) throw  new AuthException("请重新登录")
    return this.authService.getInfo(id)
  }
}
