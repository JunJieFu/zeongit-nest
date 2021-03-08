import { HttpModule, Module } from "@nestjs/common"
import { DataModule } from "../data/data.module"
import { NsfwLevelService } from "./service/nsfw-level.service"
import { PixivErrorService } from "./service/pixiv-error.service"
import { PixivUserService } from "./service/pixiv-user.service"
import { PixivWorkService } from "./service/pixiv-work.service"
import { PixivWorkDetailService } from "./service/pixiv-work-detail.service"
import { CollectController } from "./controller/collect.controller"
import { PictureService } from "./service/picture.service"
import { UserService } from "./service/user.service"
import { UserInfoService } from "./service/user-info.service"
import { QiniuModule } from "../qiniu/qiniu.module"
import { AutoPixivWorkService } from "./service/auto-pixiv-work.service"
import { AutoCollectService } from "./service/auto-collect.service"
import { ScheduleModule } from "@nestjs/schedule"
import { ConfigModule } from "@nestjs/config"
import { getEnvPaths } from "../share/fragment/env.function"
import { collectConfigType } from "./config"
import { PictureDocumentService } from "./service/picture-document.service"
import { PixivFollowingService } from "./service/pixiv-following.service"

const configModule = ConfigModule.forRoot(
  {
    envFilePath: [...getEnvPaths()], load: [collectConfigType],
    isGlobal: true
  }
)

@Module({
  imports: [configModule, DataModule, QiniuModule, HttpModule,
    ScheduleModule.forRoot()],
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
export class BeautyAdminModule {
}
