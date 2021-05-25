import { DataModule } from "@/data/data.module"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { authConfigType, jwtConfigType } from "./config"
import { JwtConfigService } from "./config-service/jwt-config.service"
import { AuthService } from "./service/auth.service"

const configModule = ConfigModule.forRoot({
  envFilePath: [`.env`, `.env.${process.env.NODE_ENV!.trim()}`],
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
