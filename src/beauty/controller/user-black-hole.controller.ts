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

class SaveDto {
  @IsInt()
  targetId!: number

}


@Controller("pictureBlackHole")
export class PictureBlackHoleController extends UserInfoVoAbstract {
  constructor(private readonly userBlackHoleService: UserBlackHoleService,
              readonly userInfoService: UserInfoService,
              readonly followService: FollowService
  ) {
    super()
  }


  @JwtAuth()
  @Post("block")
  async block(@CurrentUser() userInfo: UserInfoEntity, @Body() { targetId }: SaveDto) {
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
  async get(@CurrentUser() { id: userInfoId }: UserInfoEntity, @Query("targetId") targetId: number) {
    const vo = await this.getUserInfoVoById(targetId, userInfoId)

    const userBlackHoleVo = new UserBlackHoleVo(targetId,
      (await this.userBlackHoleService.count(userInfoId!, targetId)) ? BlockState.SHIELD : BlockState.NORMAL,
      vo.avatar, vo.nickname
    )


    // TODO
    // const tagBlackHoleVo = (await this.pictureDocumentService.listTagByUserId(targetId)).map(it =>
    //   new TagBlackHoleVo(it.keyAsString, (await this.tagBlackHoleService.get(userInfoId, it.keyAsString)) ? BlockState.SHIELD : BlockState.NORMAL)
    // )
  }

  @JwtAuth()
  @Get("paging")
  async paging(@CurrentUser() userInfo: UserInfoEntity, @PageableDefault() pageable: Pageable, @Query() query: PagingQuery) {
    query.userInfoId = userInfo.id
    const page = await this.userBlackHoleService.paging(pageable, query)
    const voList: UserBlackHoleVo[] = []
    for (const it of page.items) {
      const info = await this.getUserInfoVoById(it.targetId, userInfo.id)
      voList.push(
        new UserBlackHoleVo(info.id, BlockState.SHIELD, info.avatar, info.nickname)
      )
    }
    return new Pagination(voList, page.meta, page.links)
  }
}