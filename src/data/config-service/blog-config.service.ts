import { Inject, Injectable } from "@nestjs/common"
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { ConfigType } from "@nestjs/config"
import * as path from "path"
import { blogConfigType } from "../config";


@Injectable()
export class BlogConfigService implements TypeOrmOptionsFactory {
  constructor(@Inject(blogConfigType.KEY)
              private blogConfig: ConfigType<typeof blogConfigType>
  ) {
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.blogConfig.type,
      host: this.blogConfig.host,
      port: this.blogConfig.port,
      username: this.blogConfig.username,
      password: this.blogConfig.password,
      database: this.blogConfig.name,
      entities: [path.join(__dirname, "..", "/**/blog/*.entity{.ts,.js}")],
      charset: "utf8mb4",
      synchronize: true,
      timezone: "UTC"
    }
  }
}
