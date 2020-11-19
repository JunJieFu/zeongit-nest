import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { accountConfig } from "../../share/config/account.config"
import { AuthService } from "../service/auth.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: accountConfig.secret
    })
  }

  async validate(payload: { id: number }) {
    return this.authService.getInfo(payload.id)
  }
}
