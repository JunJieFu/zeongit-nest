import { getEnvPaths } from "@/share/fragment/env.function"
import { CacheModule, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ElasticsearchModule } from "@nestjs/elasticsearch"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserInfoCache } from "./cache/user-info.cache"
import { UserCache } from "./cache/user.cache"
import {
  accountConfigType,
  ACCOUNT_CONNECTION_NAME,
  beautyAdminConfigType,
  beautyConfigType,
  BEAUTY_ADMIN_CONNECTION_NAME,
  BEAUTY_CONNECTION_NAME,
  blogConfigType,
  BLOG_CONNECTION_NAME,
  cacheConfigType
} from "./config"
import { AccountConfigService } from "./config-service/account-config.service"
import { BeautyAdminConfigService } from "./config-service/beauty-admin-config.service"
import { BeautyConfigService } from "./config-service/beauty-config.service"
import { BlogConfigService } from "./config-service/blog-config.service"
import { CacheConfigService } from "./config-service/cache-config.service"
import { UserInfoEntity } from "./entity/account/user-info.entity"
import { UserEntity } from "./entity/account/user.entity"
import { AutoPixivWorkEntity } from "./entity/beauty-admin/auto-pixiv-work.entity"
import { NsfwLevelEntity } from "./entity/beauty-admin/nsfw-level.entity"
import { PixivErrorEntity } from "./entity/beauty-admin/pixiv-error.entity"
import { PixivFollowingEntity } from "./entity/beauty-admin/pixiv-following.entity"
import { PixivUserEntity } from "./entity/beauty-admin/pixiv-user.entity"
import { PixivWorkDetailEntity } from "./entity/beauty-admin/pixiv-work-detail.entity"
import { PixivWorkEntity } from "./entity/beauty-admin/pixiv-work.entity"
import { CollectionEntity } from "./entity/beauty/collection.entity"
import { ComplaintEntity } from "./entity/beauty/complaint.entity"
import { FeedbackEntity } from "./entity/beauty/feedback.entity"
import { FollowEntity } from "./entity/beauty/follow.entity"
import { FootprintEntity } from "./entity/beauty/footprint.entity"
import { PictureBlackHoleEntity } from "./entity/beauty/picture-black-hole.entity"
import { PictureEntity } from "./entity/beauty/picture.entity"
import { TagBlackHoleEntity } from "./entity/beauty/tag-black-hole.entity"
import { TagEntity } from "./entity/beauty/tag.entity"
import { UserBlackHoleEntity } from "./entity/beauty/user-black-hole.entity"
import { EssayEntity } from "./entity/blog/essay.entity"
import { MessageEntity } from "./entity/blog/message.entity"
import { PictureDocumentRepository } from "./repository/picture-document.repository"
import { PictureSuggestDocumentRepository } from "./repository/picture-suggest-document.repository"
import { UserInfoDocumentRepository } from "./repository/user-info-document.repository"

const configModule = ConfigModule.forRoot({
  envFilePath: [...getEnvPaths()],
  load: [
    accountConfigType,
    beautyConfigType,
    beautyAdminConfigType,
    blogConfigType,
    cacheConfigType
  ]
})

@Module({
  imports: [
    configModule,
    CacheModule.registerAsync({
      imports: [configModule],
      useClass: CacheConfigService
    }),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: AccountConfigService,
      name: ACCOUNT_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature(
      [UserEntity, UserInfoEntity],
      ACCOUNT_CONNECTION_NAME
    ),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: BeautyConfigService,
      name: BEAUTY_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature(
      [
        CollectionEntity,
        ComplaintEntity,
        FeedbackEntity,
        FollowEntity,
        FootprintEntity,
        PictureEntity,
        PictureBlackHoleEntity,
        TagEntity,
        TagBlackHoleEntity,
        UserBlackHoleEntity
      ],
      BEAUTY_CONNECTION_NAME
    ),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: BeautyAdminConfigService,
      name: BEAUTY_ADMIN_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature(
      [
        NsfwLevelEntity,
        PixivUserEntity,
        PixivWorkEntity,
        PixivWorkDetailEntity,
        PixivErrorEntity,
        AutoPixivWorkEntity,
        PixivFollowingEntity
      ],
      BEAUTY_ADMIN_CONNECTION_NAME
    ),
    TypeOrmModule.forRootAsync({
      imports: [configModule],
      useClass: BlogConfigService,
      name: BLOG_CONNECTION_NAME
    }),
    TypeOrmModule.forFeature(
      [EssayEntity, MessageEntity],
      BLOG_CONNECTION_NAME
    ),
    ElasticsearchModule.register({
      node: "http://localhost:9200"
    })
  ],
  controllers: [],
  providers: [
    UserCache,
    UserInfoCache,
    PictureDocumentRepository,
    UserInfoDocumentRepository,
    PictureSuggestDocumentRepository
  ],
  exports: [
    TypeOrmModule,
    CacheModule,
    UserCache,
    UserInfoCache,
    PictureDocumentRepository,
    UserInfoDocumentRepository,
    PictureSuggestDocumentRepository
  ]
})
export class DataModule {}
