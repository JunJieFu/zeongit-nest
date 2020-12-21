import { Gender } from "../../data/constant/gender.constant"
import { FollowState } from "../constant/follow-state.constant"
import { UserInfoEntity } from "../../data/entity/account/user-info.entity"
import { UserInfoDocument } from "../../data/document/beauty/user-info.document";

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

  constructor(userInfo: UserInfoEntity | UserInfoDocument) {
    this.id = userInfo.id!
    this.gender = userInfo.gender
    this.birthday = userInfo.birthday
    this.nickname = userInfo.nickname
    this.introduction = userInfo.introduction
    this.avatar = userInfo.avatar
    this.background = userInfo.background
    this.country = userInfo.country
    this.province = userInfo.province
    this.city = userInfo.city
  }
}
