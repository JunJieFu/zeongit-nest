import { AuthModule } from "@/auth/auth.module"
import { DataModule } from "@/data/data.module"
import { QiniuModule } from "@/qiniu/qiniu.module"
import { Module } from "@nestjs/common"
import { CollectionController } from "./controller/collection.controller"
import { ComplaintController } from "./controller/complaint.controller"
import { FeedbackController } from "./controller/feedback.controller"
import { FollowerController } from "./controller/follower.controller"
import { FollowingController } from "./controller/following.controller"
import { FootprintController } from "./controller/footprint.controller"
import { PictureBlackHoleController } from "./controller/picture-black-hole.controller"
import { PictureController } from "./controller/picture.controller"
import { QiniuController } from "./controller/qiniu.controller"
import { TagBlackHoleController } from "./controller/tag-black-hole.controller"
import { TagController } from "./controller/tag.controller"
import { UserBlackHoleController } from "./controller/user-black-hole.controller"
import { UserInfoController } from "./controller/user-info.controller"
import { WorksController } from "./controller/works.controller"
import { CollectionService } from "./service/collection.service"
import { ComplaintService } from "./service/complaint.service"
import { FeedbackService } from "./service/feedback.service"
import { FollowService } from "./service/follow.service"
import { FootprintService } from "./service/footprint.service"
import { PictureBlackHoleService } from "./service/picture-black-hole.service"
import { PictureDocumentService } from "./service/picture-document.service"
import { PictureService } from "./service/picture.service"
import { TagBlackHoleService } from "./service/tag-black-hole.service"
import { TagService } from "./service/tag.service"
import { UserBlackHoleService } from "./service/user-black-hole.service"
import { UserInfoDocumentService } from "./service/user-info-document.service"
import { UserInfoService } from "./service/user-info.service"

@Module({
  imports: [DataModule, AuthModule, QiniuModule],
  controllers: [
    CollectionController,
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
    UserBlackHoleController,
    PictureBlackHoleController,
    UserInfoController,
    WorksController
  ],
  providers: [
    CollectionService,
    ComplaintService,
    FeedbackService,
    FollowService,
    FootprintService,
    PictureService,
    PictureBlackHoleService,
    PictureDocumentService,
    TagService,
    TagBlackHoleService,
    UserBlackHoleService,
    UserInfoService,
    UserInfoDocumentService
  ],
  exports: []
})
export class BeautyModule {}
