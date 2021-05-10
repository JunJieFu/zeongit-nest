import { CurrentUser } from "@/auth/decorator/current-user.decorator"
import { JwtAuth } from "@/auth/decorator/jwt-auth.decorator"
import { CollectState } from "@/data/constant/collect-state.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { PageableDefault } from "@/share/decorator/pageable-default.decorator"
import { PermissionException } from "@/share/exception/permission.exception"
import { ProgramException } from "@/share/exception/program.exception"
import { Pageable } from "@/share/model/pageable.model"
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query
} from "@nestjs/common"
import { Type } from "class-transformer"
import { IsInt } from "class-validator"
import { Pagination } from "nestjs-typeorm-paginate"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { PagingQuery } from "../query/footprint.query"
import { CollectionService } from "../service/collection.service"
import { FollowService } from "../service/follow.service"
import { FootprintService } from "../service/footprint.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { UserInfoService } from "../service/user-info.service"
import { FootprintPictureVo } from "../vo/footprint.vo"

class FocusDto {
  @Type(() => Number)
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
  @Post("save")
  async save(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body() { pictureId }: FocusDto
  ) {
    const picture = await this.pictureDocumentService.get(pictureId)
    if (picture.privacy === PrivacyState.PRIVATE) {
      throw new PermissionException("操作有误")
    }
    try {
      await this.footprintService.update(pictureId, userInfo)
    } catch (e) {
      if (e instanceof NotFoundException) {
        await this.footprintService.save(pictureId, userInfo)
        await this.pictureDocumentService.saveViewAmount(
          picture,
          picture.viewAmount + 1
        )
      }
    }
    return picture.viewAmount
  }

  @Get("paging")
  async paging(
    @CurrentUser() userInfo: UserInfoEntity | undefined,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    if (query.targetId) {
      const page = await this.footprintService.paging(pageable, query)
      const footprintPictureVoList: FootprintPictureVo[] = []
      for (const footprint of page.items) {
        let footprintPictureVo: FootprintPictureVo
        try {
          const pictureVo = await this.getPictureVoById(
            footprint.pictureId,
            userInfo?.id
          )
          footprintPictureVo = new FootprintPictureVo(
            footprint,
            pictureVo.focus,
            //如果为屏蔽状态则吧picture设置为空
            pictureVo.privacy === PrivacyState.PRIVATE ? undefined : pictureVo
          )
        } catch (e) {
          footprintPictureVo = new FootprintPictureVo(
            footprint,
            //如果是自己就肯定是收藏状态
            query.targetId === userInfo?.id
              ? CollectState.CONCERNED
              : await this.collectionService.getCollectState(
                  footprint.pictureId,
                  userInfo?.id
                )
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
  async pagingUser(
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery,
    @CurrentUser() userInfo?: UserInfoEntity
  ) {
    if (query.pictureId) {
      const page = await this.footprintService.paging(pageable, query)
      const followingList = []
      for (const it of page.items) {
        followingList.push(
          await this.getUserInfoVoById(it.createdBy!, userInfo?.id)
        )
      }
      return new Pagination(followingList, page.meta, page.links)
    } else {
      throw new ProgramException("请传递参数pictureId")
    }
  }
}
