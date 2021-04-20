import { Inject, Injectable } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import * as path from "path"
import { beautyAdminConfigType } from "../config"

@Injectable()
export class BeautyAdminConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(beautyAdminConfigType.KEY)
    private beautyAdminConfig: ConfigType<typeof beautyAdminConfigType>
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.beautyAdminConfig.type,
      host: this.beautyAdminConfig.host,
      port: this.beautyAdminConfig.port,
      username: this.beautyAdminConfig.username,
      password: this.beautyAdminConfig.password,
      database: this.beautyAdminConfig.name,
      entities: [
        path.join(__dirname, "..", "/**/beauty-admin/*.entity{.ts,.js}")
      ],
      charset: "utf8mb4",
      synchronize: true
    }
  }
}
