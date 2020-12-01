import { Controller, Get, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { FollowService } from "../service/follow.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { CollectionService } from "../service/collection.service"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { IsInt } from "class-validator"

class FocusDto {
  @IsInt()
  pictureId!: number
}


@Controller("collection")
export class UserInfoController extends PictureVoAbstract {
  constructor(
    readonly collectionService: CollectionService,
    readonly userInfoService: UserInfoService,
    readonly pictureDocumentService: PictureDocumentService,
    readonly followService: FollowService
  ) {
    super()
  }


  @JwtAuth()
  @Get("focus")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
  focus(@CurrentUser() userInfo: UserInfoEntity, @Query() { pictureId }: FocusDto) {

  }
}
