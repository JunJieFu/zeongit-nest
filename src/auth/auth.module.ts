import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./strategy/jwt.strategy"
import { AuthService } from "./service/auth.service"
import { DataModule } from "../data/data.module"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { authConfigType, jwtConfigType } from "./config"
import { JwtConfigService } from "./service/jwt-config.service"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [jwtConfigType, authConfigType]
  }
)

@Module({
  imports: [
    configModule,
    PassportModule,
    // JwtModule.register({
    //   secret: accountConfig.secret,
    //   signOptions: { expiresIn: "360s" }
    // }),
    JwtModule.registerAsync({
      imports: [configModule],
      useClass: JwtConfigService
    }),
    DataModule
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
