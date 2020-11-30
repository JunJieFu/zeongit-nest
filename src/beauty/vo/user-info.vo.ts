import { Gender } from "../../data/constant/gender.constant"
import { FollowState } from "../constant/follow-state.constant"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"

export class UserInfoVo {
  id!: number
  gender!: Gender
  birthday!: Date
  nickname!: string
  introduction!: string
  avatar?: string
  background?: string
  country?: string
  province?: string
  city?: string
  focus: FollowState = FollowState.STRANGE

  constructor(userInfo: UserInfoEntity) {
    Object.assign(this, userInfo)
  }
}
