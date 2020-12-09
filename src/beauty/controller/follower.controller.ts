import { Controller, Get, ParseIntPipe, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { FollowService } from "../service/follow.service"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { UserInfoVoAbstract } from "../communal/user-info-vo.abstract"
import { UserInfoService } from "../service/user-info.service"
import { Pagination } from "nestjs-typeorm-paginate"

@Controller("follower")
export class FollowerController extends UserInfoVoAbstract {
  constructor(
    readonly userInfoService: UserInfoService,
    readonly followService: FollowService) {
    super()
  }

  @Get("paging")
  async paging(@CurrentUser() userInfo: UserInfoEntity | undefined, @PageableDefault() pageable: Pageable, @Query("targetId", ParseIntPipe) targetId: number) {
    const page = await this.followService.pagingByFollowingId(pageable, targetId)
    const voList = []
    for (const it of page.items) {
      voList.push(await this.getUserInfoVoById(it.createdBy!, userInfo?.id))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
