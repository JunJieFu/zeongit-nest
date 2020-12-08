import { Module } from "@nestjs/common"
import { AuthModule } from "../auth/auth.module"
import { DataModule } from "../data/data.module"
import { QiniuModule } from "../qiniu/qiniu.module"
import { CollectionController } from "./controller/collection.controller"
import { ComplaintController } from "./controller/complaint.controller"
import { FeedbackController } from "./controller/feedback.controller"
import { FollowerController } from "./controller/follower.controller"
import { FollowingController } from "./controller/following.controller"
import { FootprintController } from "./controller/footprint.controller"
import { PictureController } from "./controller/picture.controller"
import { PictureBlackHoleController } from "./controller/picture-black-hole.controller"
import { QiniuController } from "./controller/qiniu.controller"
import { TagController } from "./controller/tag.controller"
import { TagBlackHoleController } from "./controller/tag-black-hole.controller"
import { UserInfoController } from "./controller/user-info.controller"

@Module({
  imports: [DataModule, AuthModule, QiniuModule],
  controllers: [CollectionController,
    ComplaintController,
    FeedbackController,
    FollowerController,
    FollowingController,
    FootprintController,
    PictureController,
    PictureBlackHoleController,
    QiniuController,
    TagController,
    TagBlackHoleController,
    PictureBlackHoleController,
    UserInfoController],
  providers: [],
  exports: []
})
export class BeautyModule {
}
