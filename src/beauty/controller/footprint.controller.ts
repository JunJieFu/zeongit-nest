import { Body, Controller, Get, NotFoundException, Post, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { FollowService } from "../service/follow.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { FootprintService } from "../service/footprint.service"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { IsInt } from "class-validator"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { PermissionException } from "../../share/exception/permission.exception"
import { ProgramException } from "../../share/exception/program.exception"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/footprint.query"
import { Pagination } from "nestjs-typeorm-paginate"
import { FootprintPictureVo } from "../vo/footprint.vo"
import { CollectionService } from "../service/collection.service"

class FocusDto {
  @IsInt()
  pictureId!: number
}


@Controller("footprint")
export class FootprintController extends PictureVoAbstract {
  constructor(
    readonly footprintService: FootprintService,
    readonly collectionService: CollectionService,
    readonly userInfoService: UserInfoService,
    readonly pictureDocumentService: PictureDocumentService,
    readonly followService: FollowService
  ) {
    super()
  }

  @JwtAuth()
  @Post("focus")
  async focus(@CurrentUser() userInfo: UserInfoEntity, @Body() { pictureId }: FocusDto) {
    const picture = await this.pictureDocumentService.get(pictureId)
    if (picture.privacy == PrivacyState.PRIVATE) {
      throw new PermissionException("操作有误")
    }
    try {
      await this.footprintService.update(pictureId, userInfo)

    } catch (e) {
      if (e instanceof NotFoundException) {
        await this.footprintService.save(pictureId, userInfo)
        await this.pictureDocumentService.saveViewAmount(picture, picture.viewAmount + 1)
      }
    }
    return picture.viewAmount
  }

  @Get("paging")
  async paging(@PageableDefault() pageable: Pageable, @Query() query: PagingQuery, @CurrentUser() userInfo?: UserInfoEntity) {
    if (query.targetId) {
      const page = await this.footprintService.paging(pageable, query)
      const footprintPictureVoList: FootprintPictureVo[] = []
      for (const footprint of page.items) {
        let footprintPictureVo: FootprintPictureVo
        try {
          const picture = await this.pictureDocumentService.get(footprint.pictureId)
          //图片被隐藏
          if (picture.privacy == PrivacyState.PRIVATE) {
            picture.url = ""
          }
          footprintPictureVo = new FootprintPictureVo(
            picture,
            (await this.getPictureVo(picture, userInfo?.id)).focus,
            footprint.updateDate!,
            await this.getUserInfoVoById(picture.createdBy, userInfo?.id))
        } catch (e) {
          footprintPictureVo = new FootprintPictureVo(
            { id: footprint.pictureId } as PictureDocument,
            await this.footprintService.getCollectState(query.targetId, footprint.pictureId),
            footprint.updateDate!
          )
        }
        footprintPictureVoList.push(footprintPictureVo)
      }
      return new Pagination(footprintPictureVoList, page.meta, page.links)
    } else {
      throw new ProgramException("请传递参数targetId")
    }
  }

  @Get("pagingUser")
  async pagingUser(@PageableDefault() pageable: Pageable, @Query() query: PagingQuery, @CurrentUser() userInfo?: UserInfoEntity) {
    if (query.pictureId) {
      const page = await this.footprintService.paging(pageable, query)
      const followingList = []
      for (const it of page.items) {
        followingList.push(await this.getUserInfoVoById(it.createdBy!, userInfo?.id))
      }
      return new Pagination(followingList, page.meta, page.links)
    } else {
      throw new ProgramException("请传递参数pictureId")
    }
  }
}