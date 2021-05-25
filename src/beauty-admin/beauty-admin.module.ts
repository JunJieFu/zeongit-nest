import { DataModule } from "@/data/data.module"
import { QiniuModule } from "@/qiniu/qiniu.module"
import { HttpModule, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ScheduleModule } from "@nestjs/schedule"
import { collectConfigType } from "./config"
import { CollectController } from "./controller/collect.controller"
import { AutoCollectService } from "./service/auto-collect.service"
import { AutoPixivWorkService } from "./service/auto-pixiv-work.service"
import { NsfwLevelService } from "./service/nsfw-level.service"
import { PictureDocumentService } from "./service/picture-document.service"
import { PictureService } from "./service/picture.service"
import { PixivErrorService } from "./service/pixiv-error.service"
import { PixivFollowingService } from "./service/pixiv-following.service"
import { PixivUserService } from "./service/pixiv-user.service"
import { PixivWorkDetailService } from "./service/pixiv-work-detail.service"
import { PixivWorkService } from "./service/pixiv-work.service"
import { UserInfoService } from "./service/user-info.service"
import { UserService } from "./service/user.service"

const configModule = ConfigModule.forRoot({
  envFilePath: [`.env`, `.env.${process.env.NODE_ENV!.trim()}`],
  load: [collectConfigType]
})

@Module({
  imports: [
    configModule,
    DataModule,
    QiniuModule,
    HttpModule,
    ScheduleModule.forRoot()
  ],
  controllers: [CollectController],
  providers: [
    NsfwLevelService,
    PixivErrorService,
    PixivUserService,
    PixivWorkService,
    PixivWorkDetailService,
    PictureService,
    PictureDocumentService,
    UserService,
    UserInfoService,
    AutoPixivWorkService,
    AutoCollectService,
    PixivFollowingService
  ],
  exports: []
})
export class BeautyAdminModule {}
