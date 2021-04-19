import { Gender } from "../../constant/gender.constant"
import { UserInfoEntity } from "../../entity/account/user-info.entity"

export class UserInfoDocument {
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
  createDate!: Date
  updateDate!: Date

  constructor(userInfo: UserInfoEntity) {
    if (userInfo) {
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
      this.createDate = userInfo.createDate!
      this.updateDate = userInfo.updateDate!
    }
  }
}
