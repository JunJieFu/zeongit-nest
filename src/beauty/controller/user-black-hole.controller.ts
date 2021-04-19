import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { IsInt } from "class-validator"
import { UserInfoService } from "../service/user-info.service"
import { FollowService } from "../service/follow.service"
import { UserBlackHoleService } from "../service/user-black-hole.service"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { BlockState } from "../../data/constant/block-state.constant"
import { UserBlackHoleVo } from "../vo/user-black-hole.vo"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { Pagination } from "nestjs-typeorm-paginate"
import { UserInfoVoAbstract } from "../communal/user-info-vo.abstract"
import { PagingQuery } from "../query/user-black-hole.query"
import { PictureDocumentService } from "../service/picture-document.service"
import { TagBlackHoleVo } from "../vo/tag-black-hole.vo"
import { TagBlackHoleService } from "../service/tag-black-hole.service"
import { BlackHoleVo } from "../vo/black-hole.vo"

class SaveDto {
  @IsInt()
  targetId!: number
}

@Controller("userBlackHole")
export class UserBlackHoleController extends UserInfoVoAbstract {
  constructor(
    private readonly userBlackHoleService: UserBlackHoleService,
    private readonly tagBlackHoleService: TagBlackHoleService,
    private readonly pictureDocumentService: PictureDocumentService,
    readonly userInfoService: UserInfoService,
    readonly followService: FollowService
  ) {
    super()
  }

  @JwtAuth()
  @Post("block")
  async block(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body() { targetId }: SaveDto
  ) {
    if (await this.userBlackHoleService.count(userInfo.id!, targetId)) {
      await this.userBlackHoleService.remove(targetId, userInfo)
      return BlockState.NORMAL
    } else {
      await this.userBlackHoleService.save(targetId, userInfo)
      return BlockState.SHIELD
    }
  }

  @JwtAuth()
  @Get("get")
  async get(
    @CurrentUser() { id: userInfoId }: UserInfoEntity,
    @Query("targetId") targetId: number
  ) {
    const vo = await this.getUserInfoVoById(targetId, userInfoId)

    const userBlackHoleVo = new UserBlackHoleVo(
      targetId,
      (await this.userBlackHoleService.count(userInfoId!, targetId))
        ? BlockState.SHIELD
        : BlockState.NORMAL,
      vo.avatar,
      vo.nickname
    )
    const tagList = await this.pictureDocumentService.listTagByUserId(targetId)

    const tagBlackHoleVoList = []

    for (const tag of tagList) {
      tagBlackHoleVoList.push(
        new TagBlackHoleVo(
          tag.key,
          (await this.tagBlackHoleService.count(userInfoId!, tag.key))
            ? BlockState.SHIELD
            : BlockState.NORMAL
        )
      )
    }
    return new BlackHoleVo(userBlackHoleVo, tagBlackHoleVoList)
  }

  @JwtAuth()
  @Get("paging")
  async paging(
    @CurrentUser() userInfo: UserInfoEntity,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    query.userInfoId = userInfo.id
    const page = await this.userBlackHoleService.paging(pageable, query)
    const voList: UserBlackHoleVo[] = []
    for (const it of page.items) {
      const info = await this.getUserInfoVoById(it.targetId, userInfo.id)
      voList.push(
        new UserBlackHoleVo(
          info.id,
          BlockState.SHIELD,
          info.avatar,
          info.nickname
        )
      )
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
