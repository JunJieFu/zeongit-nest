import { Controller, Get, Query } from "@nestjs/common"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { CurrentUser } from "../../auth/decorator/current-user.decorator"
import { UserInfoService } from "../service/user-info.service"
import { UserInfoVoAbstract } from "../communal/user-info-vo.abstract"
import { FollowService } from "../service/follow.service"
import { ProgramException } from "../../share/exception/program.exception"
import { Type } from "class-transformer"
import { IsOptional } from "class-validator"

class GetDto {
  @Type(() => Number)
  @IsOptional()
  targetId?: number
}

@Controller("userInfo")
export class UserInfoController extends UserInfoVoAbstract {
  constructor(
    readonly userInfoService: UserInfoService,
    readonly followService: FollowService
  ) {
    super()
  }

  @Get("get")
  get(@CurrentUser() userInfo: UserInfoEntity | undefined, @Query() { targetId }: GetDto) {
    if (userInfo || targetId) {
      return this.getUserInfoVoById(targetId ?? userInfo!.id!, userInfo?.id)
    } else {
      throw new ProgramException("请传递参数targetId")
    }
  }
}
