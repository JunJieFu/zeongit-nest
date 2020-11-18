import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { accountConfig } from "../../share/config/account.config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accountConfig.secret
    })
  }

  async validate(payload: any) {
    console.log(payload)
    return { userId: payload.sub, username: payload.username }
  }
}
