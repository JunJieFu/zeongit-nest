import { Gender } from "../../data/constant/gender.constant"
import { UserInitState } from "../../data/constant/user-info-state.constant"
import { UserState } from "../../data/constant/user-state.constant"
import { Expose } from "class-transformer"

export class UserInfoVo {
  @Expose()
  id!: number
  @Expose()
  createDate!: Date
  @Expose()
  updateDate!: Date
  @Expose()
  gender!: Gender
  @Expose()
  birthday!: Date
  @Expose()
  nickname!: string
  @Expose()
  introduction!: string
  @Expose()
  country?: string
  @Expose()
  province?: string
  @Expose()
  city?: string
  @Expose()
  avatarUrl?: string
  @Expose()
  background?: string

  state!: UserInitState

  userState!: UserState
}
