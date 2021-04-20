import { Inject, Injectable } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import * as path from "path"
import { beautyConfigType } from "../config"

@Injectable()
export class BeautyConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(beautyConfigType.KEY)
    private beautyConfig: ConfigType<typeof beautyConfigType>
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.beautyConfig.type,
      host: this.beautyConfig.host,
      port: this.beautyConfig.port,
      username: this.beautyConfig.username,
      password: this.beautyConfig.password,
      database: this.beautyConfig.name,
      entities: [path.join(__dirname, "..", "/**/beauty/*.entity{.ts,.js}")],
      charset: "utf8mb4",
      synchronize: true
    }
  }
}
