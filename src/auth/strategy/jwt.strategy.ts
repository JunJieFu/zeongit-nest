import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Inject, Injectable } from "@nestjs/common"
import { AuthService } from "../service/auth.service"
import { jwtConfigType } from "../config"
import { ConfigType } from "@nestjs/config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfigType.KEY)
              private jwtConfig: ConfigType<typeof jwtConfigType>, private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secretKey
    })
  }

  validate(payload: { id: number }) {
    return this.authService.getInfo(payload.id).toPromise()
  }
}
