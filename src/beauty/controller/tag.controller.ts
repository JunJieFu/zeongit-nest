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
  listTagTop30(@CurrentUser() userInfo?: UserInfoEntity) {
    return
  }

  @Get("listTagAndPictureTop30")
  listTagAndPictureTop30(@CurrentUser() userInfo?: UserInfoEntity) {
    return
  }

  @Get("listTagFrequencyByUserId")
  listTagFrequencyByUserId(@CurrentUser() userInfo: UserInfoEntity | undefined, @Query("targetId", ParseIntPipe) targetId: number) {
    return targetId
  }
}
