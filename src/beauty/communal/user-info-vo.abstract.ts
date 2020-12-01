import { FollowService } from "../service/follow.service"
import { UserInfoService } from "../service/user-info.service"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { UserInfoVo } from "../vo/user-info.vo"

export abstract class UserInfoVoAbstract {
  abstract userInfoService: UserInfoService
  abstract followService: FollowService

  async getUserInfoVoById(followingId: number, followerId?: number) {
    return this.getUserInfoVo(await this.userInfoService.get(followingId), followerId)
  }

  async getUserInfoVo(following: UserInfoEntity, followerId?: number) {
    const vo = new UserInfoVo(following)
    vo.focus = await this.followService.getFollowState(following.id!, followerId)
    return vo
  }
}
