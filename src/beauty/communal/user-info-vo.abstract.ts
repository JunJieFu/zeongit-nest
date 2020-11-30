import { FollowService } from "../service/follow.service"
import { UserInfoService } from "../service/user-info.service"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { UserInfoVo } from "../vo/user-info.vo"
import { map, mergeMap } from "rxjs/operators"

export abstract class UserInfoVoAbstract {
  abstract userInfoService: UserInfoService
  abstract followService: FollowService

  getUserInfoVoById(followingId: number, followerId?: number) {
    return this.userInfoService.get(followingId).pipe(
      mergeMap(following => this.followService.getFollowState(followingId, followerId)
        .pipe(map(followState => ({ following, followState })))),
      map(
        ({ following, followState }) => {
          const vo = new UserInfoVo(following)
          vo.focus = followState
          return vo
        }
      )
    )
  }

  getUserInfoVo(following: UserInfoEntity, followerId?: number) {
    this.followService.getFollowState(following.id!, followerId).pipe(
      map(
        it => {
          const vo = new UserInfoVo(following)
          vo.focus = it
          return vo
        }
      )
    )
  }
}
