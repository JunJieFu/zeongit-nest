import { Module } from "@nestjs/common"
import { DataModule } from "../data/data.module"
import { NsfwLevelService } from "./service/nsfw-level.service"
import { PixivErrorService } from "./service/pixiv-error.service"
import { PixivUserService } from "./service/pixiv-user.service"
import { PixivWorkService } from "./service/pixiv-work.service"
import { PixivWorkDetailService } from "./service/pixiv-work-detail.service"

@Module({
  imports: [DataModule],
  controllers: [],
  providers: [NsfwLevelService, PixivErrorService, PixivUserService, PixivWorkService, PixivWorkDetailService],
  exports: []
})
export class AccountModule {
}
