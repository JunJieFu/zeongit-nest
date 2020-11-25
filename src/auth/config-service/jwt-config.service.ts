import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface"
import { Inject, Injectable } from "@nestjs/common"
import { jwtConfigType } from "../config"
import { ConfigType } from "@nestjs/config"

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(@Inject(jwtConfigType.KEY)
              private jwtConfig: ConfigType<typeof jwtConfigType>
  ) {
  }

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.jwtConfig.secretKey,
      signOptions: { expiresIn: this.jwtConfig.expires }
    }
  }
}
