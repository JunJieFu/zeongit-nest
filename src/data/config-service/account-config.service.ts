import { Inject, Injectable } from "@nestjs/common"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { ConfigType } from "@nestjs/config"
import { accountConfigType } from "../config"
import * as path from "path"

@Injectable()
export class AccountConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(accountConfigType.KEY)
    private accountConfig: ConfigType<typeof accountConfigType>
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.accountConfig.type,
      host: this.accountConfig.host,
      port: this.accountConfig.port,
      username: this.accountConfig.username,
      password: this.accountConfig.password,
      database: this.accountConfig.name,
      entities: [path.join(__dirname, "..", "/**/account/*.entity{.ts,.js}")],
      charset: "utf8mb4",
      synchronize: true
    }
  }
}
