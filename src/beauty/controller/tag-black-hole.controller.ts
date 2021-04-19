import { Body, Controller, Get, Post, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { TagBlackHoleService } from "../service/tag-black-hole.service"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { BlockState } from "../../data/constant/block-state.constant"
import { TagBlackHoleVo } from "../vo/tag-black-hole.vo"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { Pagination } from "nestjs-typeorm-paginate"
import { PagingQuery } from "../query/tag-black-hole.query"

@Controller("tagBlackHole")
export class TagBlackHoleController {
  constructor(private readonly tagBlackHoleService: TagBlackHoleService) {}

  @JwtAuth()
  @Post("block")
  async block(
    @CurrentUser() userInfo: UserInfoEntity,
    @Body("tag") tag: string
  ) {
    if (await this.tagBlackHoleService.count(userInfo.id!, tag)) {
      await this.tagBlackHoleService.remove(tag, userInfo)
      return BlockState.NORMAL
    } else {
      await this.tagBlackHoleService.save(tag, userInfo)
      return BlockState.SHIELD
    }
  }

  @JwtAuth()
  @Get("paging")
  async paging(
    @CurrentUser() userInfo: UserInfoEntity,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    query.userInfoId = userInfo.id
    const page = await this.tagBlackHoleService.paging(pageable, query)
    return new Pagination(
      page.items.map((it) => new TagBlackHoleVo(it.tag, BlockState.SHIELD)),
      page.meta,
      page.links
    )
  }
}
