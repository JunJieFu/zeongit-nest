import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { PictureDocumentService } from "../service/picture-document.service"


@Controller("tag")
export class TagController {
  constructor(
    private readonly pictureDocumentService: PictureDocumentService
  ) {
  }

  @Get("listTagTop30")
  async listTagTop30(@CurrentUser() userInfo?: UserInfoEntity) {
    //TODO Vo
    return this.pictureDocumentService.listTagTop30(userInfo?.id)
  }

  @Get("listTagAndPictureTop30")
  async listTagAndPictureTop30(@CurrentUser() userInfo?: UserInfoEntity) {
    const tagList = await this.pictureDocumentService.listTagTop30(userInfo?.id)
    //TODO Vo
  }

  @Get("listTagFrequencyByUserId")
  listTagFrequencyByUserId(@CurrentUser() userInfo: UserInfoEntity | undefined, @Query("targetId", ParseIntPipe) targetId: number) {
    return this.pictureDocumentService.listTagByUserId(targetId)
    //TODO vo
  }
}
