import { CacheModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entity/account/user.entity"
import { UserInfoEntity } from "./entity/account/user-info.entity"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { accountConfigType, beautyConfigType, cacheConfigType } from "./config"
import { AccountConfigService } from "./config-service/account-config.service"
import { CacheConfigService } from "./config-service/cache-config.service"
import { UserInfoCache } from "./cache/user-info.cache"
import { UserCache } from "./cache/user.cache"
import { BeautyConfigService } from "./config-service/beauty-config.service"
import { PictureDocumentRepository } from "./repository/picture-document.repository"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [accountConfigType, beautyConfigType, cacheConfigType]
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
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: BeautyConfigService
    }),
    TypeOrmModule.forFeature([UserEntity, UserInfoEntity])
  ],
  controllers: [],
  providers: [UserCache, UserInfoCache, PictureDocumentRepository],
  exports: [TypeOrmModule, CacheModule, UserCache, UserInfoCache, PictureDocumentRepository]
})
export class DataModule {
}
