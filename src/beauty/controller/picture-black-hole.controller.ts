import { Body, Controller, Get, NotFoundException, Post, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { IsInt } from "class-validator"
import { PictureBlackHoleService } from "../service/picture-black-hole.service"
import { PictureVoAbstract } from "../communal/picture-vo.abstract"
import { CollectionService } from "../service/collection.service"
import { UserInfoService } from "../service/user-info.service"
import { PictureDocumentService } from "../service/picture-document.service"
import { FollowService } from "../service/follow.service"
import { UserBlackHoleService } from "../service/user-black-hole.service"
import { TagBlackHoleService } from "../service/tag-black-hole.service"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { PictureDocument } from "../../data/document/beauty/picture.document"
import { ProgramException } from "../../share/exception/program.exception"
import { BlockState } from "../../data/constant/block-state.constant"
import { PermissionException } from "../../share/exception/permission.exception"
import { BlackHoleVo } from "../vo/black-hole.vo"
import { UserBlackHoleVo } from "../vo/user-black-hole.vo"
import { TagBlackHoleVo } from "../vo/tag-black-hole.vo"
import { PictureBlackHoleVo } from "../vo/picture-black-hole.vo"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { PagingQuery } from "../query/picture-black-hole.query"
import { PrivacyState } from "../../data/constant/privacy-state.constant"
import { Pagination } from "nestjs-typeorm-paginate"

class SaveDto {
  @IsInt()
  targetId!: number

}


@Controller("pictureBlackHole")
export class PictureBlackHoleController extends PictureVoAbstract {
  constructor(private readonly userBlackHoleService: UserBlackHoleService,
              private readonly pictureBlackHoleService: PictureBlackHoleService,
              private readonly tagBlackHoleService: TagBlackHoleService,
              readonly collectionService: CollectionService,
              readonly userInfoService: UserInfoService,
              readonly pictureDocumentService: PictureDocumentService,
              readonly followService: FollowService
  ) {
    super()
  }


  @JwtAuth()
  @Post("block")
  async block(@CurrentUser() userInfo: UserInfoEntity, @Body() { targetId }: SaveDto) {
    const userInfoId = userInfo.id!
    let picture: PictureDocument | undefined
    try {
      picture = await this.pictureDocumentService.get(targetId)
      if (picture?.createdBy === userInfoId) {
        throw new ProgramException("不能把自己的作品加入黑名单")
      }
      if (await this.pictureBlackHoleService.count(userInfoId, targetId)) {
        await this.pictureBlackHoleService.remove(targetId, userInfo)
        return BlockState.NORMAL
      } else {
        await this.pictureBlackHoleService.save(targetId, userInfo)
        return BlockState.SHIELD
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        if (await this.pictureBlackHoleService.count(userInfoId, targetId)) {
          await this.collectionService.remove(targetId, userInfo)
          return BlockState.NORMAL
        } else {
          throw new PermissionException("操作有误")
        }
      } else {
        throw e
      }
    }
  }


  @JwtAuth()
  @Get("get")
  async get(@CurrentUser() userInfo: UserInfoEntity, @Query("targetId") targetId: number) {
    const pictureVo = await this.getPictureVoById(targetId, userInfo.id)
    const userBlackHoleVo = new UserBlackHoleVo(
      pictureVo.user.id,
      (await this.userBlackHoleService.count(userInfo.id!, pictureVo.user.id)) ? BlockState.SHIELD : BlockState.NORMAL,
      pictureVo.user.avatar, pictureVo.user.nickname
    )
    const tagBlackHoleVoList = []
    for (const it of pictureVo.tagList) {
      tagBlackHoleVoList.push(
        new TagBlackHoleVo(
          it,
          (await this.tagBlackHoleService.count(userInfo.id!, it)) ? BlockState.SHIELD : BlockState.NORMAL
        )
      )
    }
    const pictureBlackHoleVo = new PictureBlackHoleVo(pictureVo.id,
      (await this.pictureBlackHoleService.count(userInfo.id!, pictureVo.id)) ? BlockState.SHIELD : BlockState.NORMAL,
      pictureVo.url,
      pictureVo.name
    )
    return new BlackHoleVo(userBlackHoleVo, tagBlackHoleVoList, pictureBlackHoleVo)
  }

  @JwtAuth()
  @Get("paging")
  async paging(@CurrentUser() userInfo: UserInfoEntity, @PageableDefault() pageable: Pageable, @Query() query: PagingQuery) {
    query.userInfoId = userInfo.id
    const page = await this.pictureBlackHoleService.paging(pageable, query)
    const blackList = []
    for (const pictureBlackHole of page.items) {
      let pictureBlackHoleVo: PictureBlackHoleVo
      try {
        const picture = await this.pictureDocumentService.get(pictureBlackHole.targetId)
        //图片被隐藏
        pictureBlackHoleVo = new PictureBlackHoleVo(pictureBlackHole.targetId,
          BlockState.SHIELD,
          picture.privacy === PrivacyState.PRIVATE ? undefined : picture.url,
          picture.name
        )
      } catch (e) {
        if (e instanceof NotFoundException || e instanceof PermissionException) {
          pictureBlackHoleVo = new PictureBlackHoleVo(pictureBlackHole.targetId, BlockState.SHIELD)
        }
        throw e
      }
      blackList.push(pictureBlackHoleVo)
    }
    return new Pagination(blackList, page.meta, page.links)
  }
}
