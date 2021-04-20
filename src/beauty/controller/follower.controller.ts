import { CurrentUser } from "@/auth/decorator/current-user.decorator"
import { UserInfoEntity } from "@/data/entity/account/user-info.entity"
import { PageableDefault } from "@/share/decorator/pageable-default.decorator"
import { Pageable } from "@/share/model/pageable.model"
import { Controller, Get, Query } from "@nestjs/common"
import { Pagination } from "nestjs-typeorm-paginate"
import { UserInfoVoAbstract } from "../communal/user-info-vo.abstract"
import { PagingQuery } from "../query/follow.query"
import { FollowService } from "../service/follow.service"
import { UserInfoService } from "../service/user-info.service"

@Controller("follower")
export class FollowerController extends UserInfoVoAbstract {
  constructor(
    readonly userInfoService: UserInfoService,
    readonly followService: FollowService
  ) {
    super()
  }

  @Get("paging")
  async paging(
    @CurrentUser() userInfo: UserInfoEntity | undefined,
    @PageableDefault() pageable: Pageable,
    @Query() query: PagingQuery
  ) {
    const page = await this.followService.pagingByFollowingId(pageable, query)
    const voList = []
    for (const it of page.items) {
      voList.push(await this.getUserInfoVoById(it.createdBy!, userInfo?.id))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
