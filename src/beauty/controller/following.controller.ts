import { Body, Controller, Get, ParseIntPipe, Post, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { FollowService } from "../service/follow.service"
import { PageableDefault } from "../../share/decorator/pageable-default.decorator"
import { Pageable } from "../../share/model/pageable.model"
import { UserInfoVoAbstract } from "../communal/user-info-vo.abstract"
import { UserInfoService } from "../service/user-info.service"
import { Pagination } from "nestjs-typeorm-paginate"
import { JwtAuth } from "../../auth/decorator/jwt-auth.decorator"
import { ProgramException } from "../../share/exception/program.exception"
import { IsInt } from "class-validator"
import { FollowState } from "../constant/follow-state.constant"


class FocusDto {
  @IsInt()
  followingId!: number
}

@Controller("following")
export class FollowingController extends UserInfoVoAbstract {
  constructor(
    readonly userInfoService: UserInfoService,
    readonly followService: FollowService) {
    super()
  }

  @JwtAuth()
  @Post("focus")
  async focus(@CurrentUser() userInfo: UserInfoEntity, @Body() { followingId }: FocusDto) {
    const userInfoId = userInfo.id!
    if (userInfoId === followingId) {
      throw new ProgramException("不能关注自己")
    }
    const state = await this.followService.getFollowState(followingId, userInfoId)
    if (state === FollowState.STRANGE) {
      await this.followService.save(followingId, userInfo)
      return FollowState.CONCERNED
    } else {
      await this.followService.remove(followingId, userInfo)
      return FollowState.STRANGE
    }
  }

  @Get("paging")
  async paging(@CurrentUser() userInfo: UserInfoEntity | undefined, @PageableDefault() pageable: Pageable, @Query("targetId", ParseIntPipe) targetId: number) {
    const page = await this.followService.pagingByFollowerId(pageable, targetId)
    const voList = []
    for (const it of page.items) {
      voList.push(await this.getUserInfoVoById(it.followingId!, userInfo?.id))
    }
    return new Pagination(voList, page.meta, page.links)
  }
}
