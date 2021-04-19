import { Module } from "@nestjs/common"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { AuthService } from "./service/auth.service"
import { DataModule } from "../data/data.module"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { authConfigType, jwtConfigType } from "./config"
import { JwtConfigService } from "./config-service/jwt-config.service"

const configModule = ConfigModule.forRoot({
  envFilePath: [...getEnvPaths()],
  load: [jwtConfigType, authConfigType],
  isGlobal: true
})

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
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
