import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { AuthService } from "./service/auth.service"
import { accountConfig } from "../share/config/account.config"
import { DataModule } from "../data/data.module"

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: accountConfig.secret,
      signOptions: { expiresIn: "360s" }
    }),
    DataModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
