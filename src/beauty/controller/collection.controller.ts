import { CurrentUser } from "@/auth/decorator/current-user.decorator"
import { JwtAuth } from "@/auth/decorator/jwt-auth.decorator"
import { CollectState } from "@/data/constant/collect-state.constant"
import { PrivacyState } from "@/data/constant/privacy-state.constant"
import { PictureDocument } from "@/data/document/beauty/picture.document"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { PageableDefault } from "@/share/decorator/pageable-default.decorator"
import { PermissionException } from "@/share/exception/permission.exception"
import { ProgramException } from "@/share/exception/program.exception"
import { Pageable } from "@/share/model/pageable.model"
import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { IsInt } from "class-validator"
import { Pagination } from "nestjs-typeorm-paginate"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { PagingQuery } from "../query/collection.query"
import { CollectionService } from "../service/collection.service"
import { FollowService } from "../service/follow.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { UserInfoService } from "../service/user-info.service"
import { CollectionPictureVo } from "../vo/collection.vo"

class FocusDto {
  @IsInt()
  pictureId!: number
}

@Controller("collection")
export class CollectionController extends PictureVoAbstract {
  constructor(
    readonly collectionService: CollectionService,
    readonly userInfoService: UserInfoService,
    readonly pictureDocumentService: PictureDocumentService,
    readonly followService: FollowService
  ) {
    super()
  }

  @JwtAuth()
  @Post("focus")
  async focus(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body() { pictureId }: FocusDto
  ) {
    const userInfoId = userInfo.id!
    let picture: PictureDocument | undefined
    try {
      picture = await this.pictureDocumentService.get(pictureId)
    } catch (e) {}

    if (picture) {
      if (picture.createdBy === userInfoId) {
        throw new ProgramException("不能收藏自己的作品")
      }
      let flag: CollectState

      if (
        (await this.collectionService.getCollectState(
          pictureId,
          userInfo.id!
        )) === CollectState.STRANGE
      ) {
        if (picture.privacy === PrivacyState.PRIVATE) {
          throw new PermissionException("不能收藏私密图片")
        }
        await this.collectionService.save(pictureId, userInfo)
        flag = CollectState.CONCERNED
      } else {
        await this.collectionService.remove(pictureId, userInfo)
        flag = CollectState.STRANGE
      }
      this.pictureDocumentService.saveLikeAmount(
        picture,
        await this.collectionService.countByPictureId(pictureId)
      )
      return flag
    } else {
      if (
        (await this.collectionService.getCollectState(
          pictureId,
          userInfo.id!
        )) === CollectState.CONCERNED
      ) {
        await this.collectionService.remove(pictureId, userInfo)
        return CollectState.STRANGE
      } else {
        throw new PermissionException("操作有误")
      }
    }
  }

  @Get("paging")
  async paging(
    @CurrentUser() userInfo: UserInfoEntity | undefined,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    if (query.targetId) {
      const page = await this.collectionService.paging(pageable, query)
      const collectionPictureVoList: CollectionPictureVo[] = []
      for (const collection of page.items) {
        let collectionPictureVo: CollectionPictureVo
        try {
          const pictureVo = await this.getPictureVoById(
            collection.pictureId,
            userInfo?.id
          )
          collectionPictureVo = new CollectionPictureVo(
            collection,
            pictureVo.focus,
            //如果为屏蔽状态则吧picture设置为空
            pictureVo.privacy === PrivacyState.PRIVATE ? undefined : pictureVo
          )
        } catch (e) {
          collectionPictureVo = new CollectionPictureVo(
            collection,
            //如果是自己就肯定是收藏状态
            query.targetId === userInfo?.id
              ? CollectState.CONCERNED
              : await this.collectionService.getCollectState(
                  collection.pictureId,
                  userInfo?.id
                )
          )
        }
        collectionPictureVoList.push(collectionPictureVo)
      }
      return new Pagination(collectionPictureVoList, page.meta, page.links)
    } else {
      throw new ProgramException("请传递参数targetId")
    }
  }

  @Get("pagingUser")
  async pagingUser(
    @CurrentUser() userInfo: UserInfoEntity | undefined,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    if (query.pictureId) {
      const page = await this.collectionService.paging(pageable, query)
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
