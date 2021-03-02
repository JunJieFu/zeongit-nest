import { Module } from "@nestjs/common"
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
import { QiniuModule } from "../qiniu/qiniu.module";
import { QiniuController } from "./controller/qiniu.controller"
import { BucketItemService } from "./service/bucket-item.service";

@Module({
  imports: [DataModule, QiniuModule],
  controllers: [CollectController, QiniuController],
  providers: [BucketItemService, NsfwLevelService, PixivErrorService, PixivUserService, PixivWorkService, PixivWorkDetailService, PictureService, UserService, UserInfoService
  ],
  exports: []
})
export class BeautyAdminModule {
}
