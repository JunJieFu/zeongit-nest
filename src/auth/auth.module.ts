import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { LocalStrategy } from "./strategy/local.strategy"
import { AuthService } from "./service/auth.service"
import { accountConfig } from "../share/config/account.config"
import { UsersService } from "./service/users.service"

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: accountConfig.secret,
      signOptions: { expiresIn: "360s" }
    })
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
