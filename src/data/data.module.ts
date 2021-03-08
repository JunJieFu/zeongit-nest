import { CacheModule, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserEntity } from "./entity/account/user.entity"
import { UserInfoEntity } from "./entity/account/user-info.entity"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import {
  ACCOUNT_CONNECTION_NAME,
  accountConfigType,
  BEAUTY_ADMIN_CONNECTION_NAME,
  BEAUTY_CONNECTION_NAME,
  beautyAdminConfigType,
  beautyConfigType,
  cacheConfigType
} from "./config"
import { AccountConfigService } from "./config-service/account-config.service"
import { CacheConfigService } from "./config-service/cache-config.service"
import { UserInfoCache } from "./cache/user-info.cache"
import { UserCache } from "./cache/user.cache"
import { BeautyConfigService } from "./config-service/beauty-config.service"
import { PictureDocumentRepository } from "./repository/picture-document.repository"
import { ElasticsearchModule } from "@nestjs/elasticsearch"
import { CollectionEntity } from "./entity/beauty/collection.entity"
import { ComplaintEntity } from "./entity/beauty/complaint.entity"
import { FeedbackEntity } from "./entity/beauty/feedback.entity"
import { FollowEntity } from "./entity/beauty/follow.entity"
import { FootprintEntity } from "./entity/beauty/footprint.entity"
import { PictureEntity } from "./entity/beauty/picture.entity"
import { PictureBlackHoleEntity } from "./entity/beauty/picture-black-hole.entity"
import { TagEntity } from "./entity/beauty/tag.entity"
import { TagBlackHoleEntity } from "./entity/beauty/tag-black-hole.entity"
import { UserBlackHoleEntity } from "./entity/beauty/user-black-hole.entity"
import { PixivUserEntity } from "./entity/beauty-admin/pixiv-user.entity"
import { BeautyAdminConfigService } from "./config-service/beauty-admin-config.service"
import { PixivWorkDetailEntity } from "./entity/beauty-admin/pixiv-work-detail.entity"
import { PixivWorkEntity } from "./entity/beauty-admin/pixiv-work.entity"
import { PixivErrorEntity } from "./entity/beauty-admin/pixiv-error.entity"
import { NsfwLevelEntity } from "./entity/beauty-admin/nsfw-level.entity"
import { UserInfoDocumentRepository } from "./repository/user-info-document.repository";
import { AutoPixivWorkEntity } from "./entity/beauty-admin/auto-pixiv-work.entity";


const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [accountConfigType, beautyConfigType, beautyAdminConfigType, cacheConfigType]
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
      useClass: AccountConfigService,
      name: ACCOUNT_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature([UserEntity,
      UserInfoEntity], ACCOUNT_CONNECTION_NAME),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: BeautyConfigService,
      name: BEAUTY_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature([
      CollectionEntity,
      ComplaintEntity,
      FeedbackEntity,
      FollowEntity,
      FootprintEntity,
      PictureEntity,
      PictureBlackHoleEntity,
      TagEntity,
      TagBlackHoleEntity,
      UserBlackHoleEntity], BEAUTY_CONNECTION_NAME),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: BeautyAdminConfigService,
      name: BEAUTY_ADMIN_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature([NsfwLevelEntity, PixivUserEntity, PixivWorkEntity,
      PixivWorkDetailEntity, PixivErrorEntity, AutoPixivWorkEntity], BEAUTY_ADMIN_CONNECTION_NAME),
    ElasticsearchModule.register({
      node: "http://localhost:9200"
    })
  ],
  controllers: [],
  providers: [UserCache, UserInfoCache, PictureDocumentRepository, UserInfoDocumentRepository],
  exports: [TypeOrmModule, CacheModule, UserCache, UserInfoCache, PictureDocumentRepository, UserInfoDocumentRepository]
})
export class DataModule {
}
