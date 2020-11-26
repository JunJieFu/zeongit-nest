import { CacheModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entity/user.entity"
import { UserInfoEntity } from "./entity/user-info.entity"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { accountConfigType, cacheConfigType } from "./config"
import { AccountConfigService } from "./config-service/account-config.service"
import { CacheConfigService } from "./config-service/cache-config.service"
import { UserInfoCache } from "./cache/user-info.cache"
import { UserCache } from "./cache/user.cache"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [accountConfigType, cacheConfigType]
  }
)

@Module({
  imports: [
    configModule,
    CacheModule.registerAsync(
      {
        imports: [configModule],
        useClass: CacheConfigService
      }
    ),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: AccountConfigService
    }),
    TypeOrmModule.forFeature([UserEntity, UserInfoEntity])
  ],
  controllers: [],
  providers: [UserCache, UserInfoCache],
  exports: [TypeOrmModule, CacheModule, UserCache, UserInfoCache]
})
export class DataModule {
}
